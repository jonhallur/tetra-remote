import 'webmidi';
import * as R from 'ramda'
import {throttle, debounce} from 'lodash'
import { writable } from 'svelte/store'; 
import {parseProgramEditBuffer} from '../DumpParser'

const NOTE_OFF = 0b1000;
const NOTE_ON = 0b1001;
const POLY_PRESSURE = 0b1010;
const CONTROL_CHANGE = 0b1011;
const PROGRAM_CHANGE = 0b1100;
const CHAN_PRESSURE = 0b1101;
const PITCH_BEND = 0b1110;

const PARAM_NUM_MSB = 99;
const PARAM_NUM_LSB = 98;
const DATA_ENTRY_MSB = 6;
const DATA_ENTRY_LSB = 38;
const BANK_SELECT = 32;


let inputs = [];
let outputs = [];
let selectedRemoteChannel = 1;
let selectedControllerChannel = 1;
let remoteChannelStore = writable(selectedRemoteChannel);
let controllerChannelStore = writable(selectedControllerChannel);

let inputsStore = writable([]);
let outputsStore = writable([]);
let hasStarted = writable(false);
let hasFullDuplexMidi = writable(false);
let remoteInput : WebMidi.MIDIInput;
let remoteOutput : WebMidi.MIDIOutput;
let controllerInput : WebMidi.MIDIInput;
let programEditBuffer = writable({})

class TwoBytes {
    msb: number;
    lsb: number;
    constructor(msb : number) {
        this.msb = msb;
        this.lsb = 0;
    }
    setMSB(msb : number) {
        this.msb = msb & 0xFF
    }
    setLSB(lsb : number) {
        this.lsb = lsb & 0xFF
    }

    set(value : number) {
        this.setMSB(value & 0xF0);
        this.setLSB(value & 0x0F);
    }
    getBothBytes() : number {
        return 128*this.msb + this.lsb;
    }
}

class NRPN {
    parameter: TwoBytes;
    value: TwoBytes;
    constructor(msb : number) {
        this.parameter = new TwoBytes(msb);
        this.value = new TwoBytes(0);
    }
}
let bank : number = 0;
let program : number = 0;
let currentNRPN : NRPN;

const throttledGetDevices = throttle(getDevices, 500);

function requestSysExDump() {
    console.log("req")
    if (remoteOutput && remoteInput) {
        remoteOutput.send([
            0xF0, 0x01, 0x26, 0x06, 0xF7
        ]);
    }
}


function handleControlChange(data1 : number, data2 : number) {
    
    if (data1 === PARAM_NUM_MSB)
        currentNRPN = new NRPN(data2);
    else if(data1 === PARAM_NUM_LSB)
        currentNRPN.parameter.setLSB(data2);
    else if(data1 === DATA_ENTRY_MSB)
        currentNRPN.value.setMSB(data2);
    else if(data1 === DATA_ENTRY_LSB) {
        currentNRPN.value.setLSB(data2);
    }
    else if(data1 === BANK_SELECT) {
        requestSysExDump();
    }
}

function handleMidiInput(event: WebMidi.MIDIMessageEvent) {
    let [status, data1, data2] = event.data;
    //console.log(status, data1, data2)
    if (status < 0b11110000) {
        let channel = status & 0b00001111
        let eventType = status >> 4
        switch(eventType) {
            case NOTE_OFF:
            case NOTE_ON:
            case POLY_PRESSURE:
            case CONTROL_CHANGE:
                handleControlChange(data1, data2);
                break;
            case PROGRAM_CHANGE:
                requestSysExDump();
        }
    }
    else if (status === 240) {
        console.log(status)
        let buffer = parseProgramEditBuffer(Array.from(event.data));
        programEditBuffer.set(buffer)
        if(remoteOutput){ 
            sendNRPN(117, 0);
            console.log("editor byte")
        }
    }
}

function onStateChange(event: WebMidi.MIDIConnectionEvent ) {
    throttledGetDevices();
}

async function getDevices() {
    inputs = [];
    outputs = [];
    let access = await navigator.requestMIDIAccess({sysex: true});
    for(let input of access.inputs.values())
        inputs.push(input);
    for(let output of access.outputs.values())
        outputs.push(output);
    inputsStore.set(inputs);
    outputsStore.set(outputs);
}

async function useMidi() {
    getDevices();
    let access = await navigator.requestMIDIAccess({sysex: true});
    access.onstatechange = onStateChange
    hasStarted.set(true);
}

function markUsedMidis() {
    setTimeout(() => {
        inputsStore.set(inputs);
        outputsStore.set(outputs);
    }, 500);
    
}

function midiDuplexCheck() {
    if(remoteInput && remoteOutput)
        hasFullDuplexMidi.set(true);
    else
        hasFullDuplexMidi.set(false);
}

function selectRemoteOutput(selectedId:string) {
    let selected = R.find(R.propEq('id', selectedId), outputs);
    remoteOutput = selected;
    midiDuplexCheck();
    markUsedMidis();
}

function selectRemoteInput(selectedId: string) {
    if(remoteInput)
        remoteInput.onmidimessage = null;

    let selected = R.find(R.propEq('id', selectedId), inputs);
    remoteInput = selected;
    if(selected) {
        selected.onmidimessage = handleMidiInput;
    }
    midiDuplexCheck();
    markUsedMidis();

}

function forwardToOutput(event : WebMidi.MIDIMessageEvent) {
    if(remoteOutput)
        remoteOutput.send(event.data)
}

function selectControllerInput(selectedId: string) {
    if(controllerInput)
        controllerInput.onmidimessage = null;
    
    let selected = R.find(R.propEq('id', selectedId), inputs);
    controllerInput = selected;
    if(selected)
        selected.onmidimessage = forwardToOutput;

    markUsedMidis();
    
}

function sendNRPN(nrpn:number, value:number) {
    if (remoteOutput) {
        let nrpnMSB = (0b110000000 & nrpn) >> 7;
        let nrpnLSB = 0b01111111 & nrpn;
        let valueMSB = (0b110000000 & value) >> 7;
        let valueLSB = 0b01111111 & value;
        let channel = 0;
        let CCStatus = 0b10110000 | channel;
        remoteOutput.send([CCStatus, 99, nrpnMSB]);
        remoteOutput.send([CCStatus, 98, nrpnLSB]);
        remoteOutput.send([CCStatus, 6, valueMSB]);
        remoteOutput.send([CCStatus, 38, valueLSB]);
    }
}

function selectRemoteChannel(channel: number) {
    selectedRemoteChannel = channel;
    remoteChannelStore.set(channel);
}

function selectControllerChannel(channel: number) {
    selectedControllerChannel = channel;
    controllerChannelStore.set(channel);
}

export {
    useMidi, 
    inputsStore as midiInputs, 
    outputsStore as midiOutputs, 
    selectRemoteOutput,
    selectRemoteInput,
    selectControllerInput,
    requestSysExDump,
    hasFullDuplexMidi,
    programEditBuffer,
    sendNRPN,
    remoteChannelStore,
    controllerChannelStore,
    selectControllerChannel,
    selectRemoteChannel
};