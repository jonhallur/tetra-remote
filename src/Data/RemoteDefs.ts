import {tetraParams as t} from './TetraKeyDefs'
import * as R from 'ramda'
const toString = R.map(R.toString);
const stringRange = (start : number, end: number) => toString(R.range(start, end+1))
const MOD_SOURCES = [
    "Off",
    "Sequence Track 1",
    "Sequence Track 2",
    "Sequence Track 3",
    "Sequence Track 4",
    "LFO 1",
    "LFO 2",
    "LFO 3",
    "LFO 4",
    "Filter Envelope",
    "Amp Envelope",
    "Envelope 3",
    "Pitch Bend",
    "Mod Wheel",
    "Pressure",
    "MIDI Breath",
    "MIDI Foot",
    "MIDI Expression",
    "Velocity",
    "Note Number",
    "Noise"
];
const MOD_DESTINATIONS = [
    "Off",
    "Osc 1 Freq",
    "Osc 2 Freq",
    "Osc 1 and 2 Freq",
    "Osc Mix",
    "Noise Level",
    "Osc 1 Pulse Width",
    "Osc 2 Pulse Width",
    "Osc 1 and 2 Pulse Width",
    "Filter Frequency",
    "Resonance",
    "Filter Audio Mod Amt",
    "VCA Level",
    "Pan Spread",
    "LFO 1 Freq",
    "LFO 2 Freq",
    "LFO 3 Freq",
    "LFO 4 Freq",
    "All LFO Freq",
    "LFO 1 Amt",
    "LFO 2 Amt",
    "LFO 3 Amt",
    "LFO 4 Amt",
    "All LFO Amt",
    "Filter Env Amt",
    "Amp Env Amt",
    "Env 3 Amt",
    "All Env Amounts",
    "Env 1 Attack",
    "Env 2 Attack",
    "Env 3 Attack",
    "All Env Attacks",
    "Env 1 Decay",
    "Env 2 Decay",
    "Env 3 Decay",
    "All Env Decays",
    "Env 1 Release",
    "Env 2 Release",
    "Env 3 Release",
    "All Env Releases",
    "Mod 1 Amt",
    "Mod 2 Amt",
    "Mod 3 Amt",
    "Mod 4 Amt",
    "Feedback Volume",
    "Sub Osc 1 Level",
    "Sub Osc 2 Level",
    "Feedback Gain",
    "Slew"
];
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [0,1,2,3,4,5,6,7,8,9];
const FreqValues = [...R.chain(oct => R.map(note => note + oct,NOTES), OCTAVES), 'C10']
const PULSE_RANGES = R.map(n => "Pulse " + n, toString(R.range(0, 100)));
const ASCII = ['(space)', ...R.map(String.fromCharCode, R.range(33, 128))];
const WaveForms = ['Off', 'Saw', 'Triangle', 'Saw / Tri', ...PULSE_RANGES]
const OFF_ON = ['Off', 'On']
const SEVEN_BITS = stringRange(0,127);
const LFO_FREQ = [
    ...stringRange(0,150), '32st', '16st', '8st', '6st', '4st', '3st', '2st', '1.5st', 
    '1', '2/3', '1/2', '1/3', '1/4', '1/6', '1/8', '1/16'
]
const LFO_WAVE = ['Tri', 'RSaw', 'Saw', 'Squ', 'Rnd']
const ARP_MODES = [
    'Up', 'Down', 'Up/Down', 'Assign', 'Random', 
    '2 Up', '2 Down', '2 Up/Down', '2 Assign', '2 Random',
    '3 Up', '3 Down', '3 Up/Down', '3 Assign', '3 Random',
]
const CLOCK_DIVIDE = [
    '1/2', '1/4', '1/8', '1/8 half swing', '1/8 full swing', '1/8 3rd',
    '1/16', '1/16 half swing', '1/16 full swing', '1/16 3rd',
    '1/32', '1/32 3rd', '1/64 3rd'
]
const SEVEN_BIT_CONTROL = (label: string, key: string, def: number, nrpn: number) : IControl => { 
    return {
        label, key, min: 0, max: 127, values: SEVEN_BITS, default: def, nrpn
    }
}
const ENV_AMOUNT = (label: string, key: string, nrpn: number): IControl => {
    return {
        label, key, min: 0, max: 254, values: toString(R.range(-127, 128)), default: 128, nrpn
    }
}
const DESTINATION = (label: string, key: string, nrpn: number): IControl => {
    return {
        label, key, min: 0, max: 47, values: MOD_DESTINATIONS, default: 0, nrpn
    }
}

const SEQ_TRACK = (label: string, key: string, nrpn: number): IControl => {
    return {
        label, key, min: 0, max: 127, default: 0, values: [...toString(R.range(0,126)), 'Reset', 'Rest'], nrpn
    }
}

const NAME_CHAR = (label: string, key: string, nrpn: number): IControl => {
    return {
        label, key, min: 32, max: 127, default: 0, values: ASCII, nrpn
    }
}

interface IControl {
    label : string;
    key: string;
    min: number;
    max: number;
    values: Array<string>;
    nrpn: number;
    default : number;
    current? : number;
}

interface ITab {
    name:string;
    controls: Array<IControl>;
}

interface ICategory {
    width?: number;
    height?: number;
    tabs: Array<ITab>
}

interface ILayer {
    name: string;
    categories: Array<ICategory>
}

type IRemote = Array<ILayer>;

let TetraRemote : IRemote =
[
    {
        name: "Layer A",
        categories: [
            {
                width: 4,
                height: 2,
                tabs: [
                    {
                        name: "Osc1",
                        controls: [
                            {
                                label: "Freq",
                                key: t.a.osc.a.freq,
                                min: 0,
                                max: 120,
                                values: FreqValues,
                                nrpn: 0,
                                default: 24
                            },{
                                label: "Fine",
                                key: t.a.osc.a.fine,
                                min: 0,
                                max: 100,
                                values: toString(R.range(-50, 51)),
                                nrpn: 1,
                                default: 50
                            },{
                                label: "Shape",
                                key: t.a.osc.a.shape,
                                min: 0,
                                max: 103,
                                values: WaveForms,
                                nrpn: 2,
                                default: 1
                            },{
                                label: 'Track',
                                key: t.a.osc.a.track,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                nrpn: 4,
                                default: 1
                            },{
                                label: "Sub",
                                key: t.a.osc.a.sub,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 114,
                                default: 0
                            },{
                                label: "Glide",
                                key: t.a.osc.a.glide,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 3,
                                default: 0
                            }
                        ]
                    },
                    {
                        name: "Osc2",
                        controls: [
                            {
                                label: "Freq",
                                key: t.a.osc.b.freq,
                                min: 0,
                                max: 120,
                                values: FreqValues,
                                nrpn: 5,
                                default: 24
                            },{
                                label: "Fine",
                                key: t.a.osc.b.fine,
                                min: 0,
                                max: 100,
                                values: toString(R.range(-50, 51)),
                                nrpn: 6,
                                default: 50
                            },{
                                label: "Shape",
                                key: t.a.osc.b.shape,
                                min: 0,
                                max: 103,
                                values: WaveForms,
                                nrpn: 7,
                                default: 1
                            },{
                                label: 'Track',
                                key: t.a.osc.b.track,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                nrpn: 9,
                                default: 1
                            },{
                                label: "Sub",
                                key: t.a.osc.b.sub,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 115,
                                default: 0
                            },{
                                label: "Glide",
                                key: t.a.osc.b.glide,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 8,
                                default: 0
                            }
                        ]
                    },
                    {
                        name: "Common",
                        controls: [
                            {
                                label: "Sync",
                                key: t.a.osc.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                nrpn: 10,
                                default: 0
                            },
                            {
                                label: "Glide",
                                key: t.a.osc.glide,
                                min: 0,
                                max: 3,
                                values: ['Rate', 'Rate auto', 'Time', 'Time auto'],
                                nrpn: 11,
                                default: 0
                            },
                            {
                                label: "Slop",
                                key: t.a.osc.slop,
                                min: 0,
                                max: 5,
                                values: toString(R.range(0, 6)),
                                nrpn: 12,
                                default: 0
                            },
                            {
                                label: "Bend",
                                key: t.a.osc.bend,
                                min: 0,
                                max: 12,
                                values: toString(R.range(0, 13)),
                                nrpn: 93,
                                default: 2
                            },
                            {
                                label: "Mix",
                                key: t.a.osc.mix,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 13,
                                default: 0
                            },
                            {
                                label: "Noise",
                                key: t.a.osc.noise,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 14,
                                default: 0
                            },
                            {
                                label: "Fdb Vol",
                                key: t.a.osc.feedback.volume,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 116,
                                default: 0
                            },
                            {
                                label: "Fdb Gain",
                                key: t.a.osc.feedback.gain,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 110,
                                default: 0
                            }
                        ]
                    },
                    {
                        name: "Misc",
                        controls: [
                            {
                                label: "Unison",
                                key: t.a.osc.unison.on,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 99 
                            },
                            {
                                label: "Uni Mode",
                                key: t.a.osc.unison.priority,
                                min: 0,
                                max: 5,
                                values: ['Low', 'Low retrig', 'High', 'High retrig', 'Last', 'Last retrig'],
                                default: 0,
                                nrpn: 96 
                            },
                            {
                                label: "Uni Prio",
                                key: t.a.osc.unison.mode,
                                min: 0,
                                max: 4,
                                values: ['One', 'All', 'Detune 1', 'Detune 2', 'Detune 3'],
                                default: 0,
                                nrpn: 95 
                            },
                            {
                                label: "Psh key",
                                key: t.a.bits.push.note,
                                min: 0,
                                max: 120,
                                values: FreqValues,
                                default: 24,
                                nrpn: 111
                            },
                            {
                                label: "Psh Velo",
                                key: t.a.bits.push.velo,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                default: 24,
                                nrpn: 112
                            },
                            {
                                label: "Psh Mode",
                                key: t.a.bits.push.mode,
                                min: 0,
                                max: 1,
                                values: ['Normal', 'Toggle'],
                                default: 0,
                                nrpn: 113
                            }
                        ]
                    }
                ]
            },
            {
                width: 6,
                height: 2,
                tabs: [
                    {
                        name: "LPF",
                        controls: [
                            {
                                label: "Freq",
                                key: t.a.lpf.freq,
                                min: 0,
                                max: 164,
                                values: toString(R.range(0, 165)),
                                nrpn: 15,
                                default: 164
                            },
                            {
                                label: "Reso",
                                key: t.a.lpf.reso,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 16,
                                default: 0
                            },
                            {
                                label: "Key",
                                key: t.a.lpf.key,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 17,
                                default: 0
                            },
                            {
                                label: "Aud X",
                                key: t.a.lpf.mod,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 18,
                                default: 0
                            },
                            {
                                label: "Poles",
                                key: t.a.lpf.poles,
                                min: 0,
                                max: 1,
                                values: ["2-pole", "4-pole"],
                                nrpn: 19,
                                default: 0
                            },
                            ENV_AMOUNT("Env", t.a.lpf.env.amount, 20),
                            {
                                label: "Velo",
                                key: t.a.lpf.env.velo,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 21,
                                default: 0
                            },
                            {
                                label: "Delay",
                                key: t.a.lpf.env.delay,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 22,
                                default: 0
                            },
                            {
                                label: "Attack",
                                key: t.a.lpf.env.attack,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 23,
                                default: 0
                            },
                            {
                                label: "Decay",
                                key: t.a.lpf.env.decay,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 24,
                                default: 0
                            },
                            {
                                label: "Sustain",
                                key: t.a.lpf.env.delay,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 25,
                                default: 127
                            },
                            {
                                label: "Release",
                                key: t.a.lpf.env.release,
                                min: 0,
                                max: 127,
                                values: SEVEN_BITS,
                                nrpn: 26,
                                default: 0
                            }
                        ]
                    },
                    {
                        name: "VCA",
                        controls: [
                            SEVEN_BIT_CONTROL("Init", t.a.amp.initial, 0, 27),
                            SEVEN_BIT_CONTROL("Spread", t.a.amp.spread, 0, 28),
                            SEVEN_BIT_CONTROL("Vol", t.a.amp.volume, 127, 29),
                            SEVEN_BIT_CONTROL("Env", t.a.amp.env.amount, 127, 30),
                            SEVEN_BIT_CONTROL("Velo", t.a.amp.env.velo, 0, 31),
                            SEVEN_BIT_CONTROL("Delay", t.a.amp.env.delay, 0, 32),
                            SEVEN_BIT_CONTROL("Attack", t.a.amp.env.attack, 0, 33),
                            SEVEN_BIT_CONTROL("Decay", t.a.amp.env.decay, 0, 34),
                            SEVEN_BIT_CONTROL("Sustain", t.a.amp.env.sustain, 127, 35),
                            SEVEN_BIT_CONTROL("Release", t.a.amp.env.release, 0, 36), 
                        ]
                    },
                    {
                        name: "Env3",
                        controls: [
                            {
                                label: "Dest",
                                key: t.a.env3.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 57
                            },
                            {
                                label: "Repeat",
                                key: t.a.env3.repeat,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 98
                            },
                            ENV_AMOUNT("Env", t.a.env3.env.amount, 58),
                            SEVEN_BIT_CONTROL("Velo", t.a.env3.env.velo, 0, 59),
                            SEVEN_BIT_CONTROL("Delay", t.a.env3.env.delay, 0, 60),
                            SEVEN_BIT_CONTROL("Attack", t.a.env3.env.attack, 0, 61),
                            SEVEN_BIT_CONTROL("Decay", t.a.env3.env.decay, 0, 62),
                            SEVEN_BIT_CONTROL("Sustain", t.a.env3.env.sustain, 127, 63),
                            SEVEN_BIT_CONTROL("Release", t.a.env3.env.release, 0, 64),
                        ]
                    },
                ]
            },
            {
                height: 2,
                width: 3,
                tabs: [
                    {
                        name: "LFO 1",
                        controls: [
                            {
                                label: 'Freq',
                                key: t.a.lfo.a.freq,
                                min: 0, 
                                max: 166,
                                values: LFO_FREQ,
                                default: 159,
                                nrpn: 37
                            },
                            {
                                label: 'Shape',
                                key: t.a.lfo.a.shape,
                                min: 0,
                                max: 4,
                                values: LFO_WAVE,
                                default: 0,
                                nrpn: 38
                            },
                            SEVEN_BIT_CONTROL("Amount", t.a.lfo.a.amount, 0, 39),
                            {
                                label: 'Dest',
                                key: t.a.lfo.a.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 40
                            },
                            {
                                label: 'Sync',
                                key: t.a.lfo.a.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 41
                            }
                        ]
                    },
                    {
                        name: "LFO 2",
                        controls: [
                            {
                                label: 'Freq',
                                key: t.a.lfo.b.freq,
                                min: 0, 
                                max: 166,
                                values: LFO_FREQ,
                                default: 159,
                                nrpn: 42
                            },
                            {
                                label: 'Shape',
                                key: t.a.lfo.b.shape,
                                min: 0,
                                max: 4,
                                values: LFO_WAVE,
                                default: 0,
                                nrpn: 43
                            },
                            SEVEN_BIT_CONTROL("Amount", t.a.lfo.b.amount, 0, 44),
                            {
                                label: 'Dest',
                                key: t.a.lfo.b.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 45
                            },
                            {
                                label: 'Sync',
                                key: t.a.lfo.b.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 46
                            }
                        ]
                    },
                    {
                        name: "LFO 3",
                        controls: [
                            {
                                label: 'Freq',
                                key: t.a.lfo.c.freq,
                                min: 0, 
                                max: 166,
                                values: LFO_FREQ,
                                default: 159,
                                nrpn: 47
                            },
                            {
                                label: 'Shape',
                                key: t.a.lfo.c.shape,
                                min: 0,
                                max: 4,
                                values: LFO_WAVE,
                                default: 0,
                                nrpn: 48
                            },
                            SEVEN_BIT_CONTROL("Amount", t.a.lfo.c.amount, 0, 49),
                            {
                                label: 'Dest',
                                key: t.a.lfo.c.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 50
                            },
                            {
                                label: 'Sync',
                                key: t.a.lfo.c.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 51
                            }
                        ]
                    },
                    {
                        name: "LFO 4",
                        controls: [
                            {
                                label: 'Freq',
                                key: t.a.lfo.d.freq,
                                min: 0, 
                                max: 166,
                                values: LFO_FREQ,
                                default: 159,
                                nrpn: 52
                            },
                            {
                                label: 'Shape',
                                key: t.a.lfo.d.shape,
                                min: 0,
                                max: 4,
                                values: LFO_WAVE,
                                default: 0,
                                nrpn: 53
                            },
                            SEVEN_BIT_CONTROL("Amount", t.a.lfo.d.amount, 0, 54),
                            {
                                label: 'Dest',
                                key: t.a.lfo.d.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 55
                            },
                            {
                                label: 'Sync',
                                key: t.a.lfo.d.sync,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 56
                            }
                        ]
                    }
                ]
            },
            {
                height: 1,
                width: 3,
                tabs: [
                    {
                        name: "MOD 1",
                        controls: [
                            {
                                label: "Source",
                                key: t.a.mod.a.source,
                                min: 0,
                                max: 20,
                                values: MOD_SOURCES,
                                default: 0,
                                nrpn: 65
                            },
                            {
                                label: "Amount",
                                key: t.a.mod.a.amount,
                                min: 0,
                                max: 254,
                                values: stringRange(-127, 128),
                                default: 0,
                                nrpn: 66
                            },
                            {
                                label: "Dest",
                                key: t.a.mod.a.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 67
                            }
                        ]
                    },
                    {
                        name: "MOD 2",
                        controls: [
                            {
                                label: "Source",
                                key: t.a.mod.b.source,
                                min: 0,
                                max: 20,
                                values: MOD_SOURCES,
                                default: 0,
                                nrpn: 68
                            },
                            {
                                label: "Amount",
                                key: t.a.mod.b.amount,
                                min: 0,
                                max: 254,
                                values: stringRange(-127, 128),
                                default: 0,
                                nrpn: 69
                            },
                            {
                                label: "Dest",
                                key: t.a.mod.b.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 70
                            }
                        ]
                    },
                    {
                        name: "MOD 3",
                        controls: [
                            {
                                label: "Source",
                                key: t.a.mod.c.source,
                                min: 0,
                                max: 20,
                                values: MOD_SOURCES,
                                default: 0,
                                nrpn: 71
                            },
                            {
                                label: "Amount",
                                key: t.a.mod.c.amount,
                                min: 0,
                                max: 254,
                                values: stringRange(-127, 128),
                                default: 0,
                                nrpn: 72
                            },
                            {
                                label: "Dest",
                                key: t.a.mod.c.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 73
                            }
                        ]
                    },
                    {
                        name: "MOD 4",
                        controls: [
                            {
                                label: "Source",
                                key: t.a.mod.d.source,
                                min: 0,
                                max: 20,
                                values: MOD_SOURCES,
                                default: 0,
                                nrpn: 74
                            },
                            {
                                label: "Amount",
                                key: t.a.mod.d.amount,
                                min: 0,
                                max: 254,
                                values: stringRange(-127, 128),
                                default: 0,
                                nrpn: 75
                            },
                            {
                                label: "Dest",
                                key: t.a.mod.d.destination,
                                min: 0,
                                max: 43,
                                values: MOD_DESTINATIONS,
                                default: 0,
                                nrpn: 76
                            }
                        ]
                    },
                ]
            },
            {
                height: 1,
                width: 3,
                tabs: [
                    {
                        name: "Wheel",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.wheel.amount, 81),
                            DESTINATION("Dest", t.a.mod.wheel.destination, 82)
                        ]
                    },
                    {
                        name: "Press",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.pressure.amount, 83),
                            DESTINATION("Dest", t.a.mod.pressure.destination, 84)
                        ]
                    },
                    {
                        name: "Breath",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.breath.amount, 85),
                            DESTINATION("Dest", t.a.mod.breath.destination, 86)
                        ]
                    },
                    {
                        name: "Velo",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.velo.amount, 87),
                            DESTINATION("Dest", t.a.mod.velo.destination, 88)
                        ]
                    },
                    {
                        name: "Foot",
                        controls: [
                            ENV_AMOUNT("Amount", t.a.mod.foot.amount, 89),
                            DESTINATION("Dest", t.a.mod.foot.destination, 90)
                        ]
                    }
                ]
            },
            {
                height: 2,
                width: 8,
                tabs: [
                    {
                        name: "Seq",
                        controls: [
                            {
                                label: 'Seq toggle',
                                key: t.a.bits.seq.toggle,
                                min: 0,
                                max: 1,
                                default: 0,
                                values: OFF_ON,
                                nrpn: 101
                            },
                            {
                                label: 'Seq Mode',
                                key: t.a.bits.seq.trigger,
                                min: 0,
                                max: 4,
                                default: 0,
                                values: ['Normal', 'Normal, no reset', 'No gate', 'No gate, no reset', 'Key step'],
                                nrpn: 94
                            },
                            DESTINATION("Dest 1", t.a.bits.seq.destination.a, 77),
                            DESTINATION("Dest 2", t.a.bits.seq.destination.b, 78),
                            DESTINATION("Dest 3", t.a.bits.seq.destination.c, 79),
                            DESTINATION("Dest 4", t.a.bits.seq.destination.d, 80),
                            {
                                label: "Clock",
                                key: t.a.bits.arp.clock,
                                min: 0,
                                max: 12,
                                values: CLOCK_DIVIDE,
                                default: 0,
                                nrpn: 92
                            },
                            {
                                label: "BPM",
                                key: t.a.bits.arp.bpm,
                                min: 0,
                                max: 220,
                                values: toString(R.range(0, 221)),
                                default: 0,
                                nrpn: 91
                            },
                            {
                                label: "Arp toggle",
                                key: t.a.bits.arp.on,
                                min: 0,
                                max: 1,
                                values: OFF_ON,
                                default: 0,
                                nrpn: 100
                            },
                            {
                                label: "Arp Mode",
                                key: t.a.bits.arp.mode,
                                min: 0,
                                max: 14,
                                values: ARP_MODES,
                                default: 0,
                                nrpn: 97
                            },
                        ]
                    },
                    {
                        name: 'Track 1',
                        controls: [
                            SEQ_TRACK('Step 1', t.a.track.a.a, 120),
                            SEQ_TRACK('Step 2', t.a.track.a.b, 121),
                            SEQ_TRACK('Step 3', t.a.track.a.c, 122),
                            SEQ_TRACK('Step 4', t.a.track.a.d, 123),
                            SEQ_TRACK('Step 5', t.a.track.a.e, 124),
                            SEQ_TRACK('Step 6', t.a.track.a.f, 125),
                            SEQ_TRACK('Step 7', t.a.track.a.g, 126),
                            SEQ_TRACK('Step 8', t.a.track.a.h, 127),
                            SEQ_TRACK('Step 9', t.a.track.a.i, 128),
                            SEQ_TRACK('Step 10', t.a.track.a.j, 129),
                            SEQ_TRACK('Step 11', t.a.track.a.k, 130),
                            SEQ_TRACK('Step 12', t.a.track.a.l, 131),
                            SEQ_TRACK('Step 13', t.a.track.a.m, 132),
                            SEQ_TRACK('Step 14', t.a.track.a.n, 133),
                            SEQ_TRACK('Step 15', t.a.track.a.o, 134),
                            SEQ_TRACK('Step 16', t.a.track.a.p, 135),

                        ]
                    },
                    {
                        name: 'Track 2',
                        controls: [
                            SEQ_TRACK('Step 1', t.a.track.b.a, 136),
                            SEQ_TRACK('Step 2', t.a.track.b.b, 137),
                            SEQ_TRACK('Step 3', t.a.track.b.c, 138),
                            SEQ_TRACK('Step 4', t.a.track.b.d, 139),
                            SEQ_TRACK('Step 5', t.a.track.b.e, 140),
                            SEQ_TRACK('Step 6', t.a.track.b.f, 141),
                            SEQ_TRACK('Step 7', t.a.track.b.g, 142),
                            SEQ_TRACK('Step 8', t.a.track.b.h, 143),
                            SEQ_TRACK('Step 9', t.a.track.b.i, 144),
                            SEQ_TRACK('Step 10', t.a.track.b.j, 145),
                            SEQ_TRACK('Step 11', t.a.track.b.k, 146),
                            SEQ_TRACK('Step 12', t.a.track.b.l, 147),
                            SEQ_TRACK('Step 13', t.a.track.b.m, 148),
                            SEQ_TRACK('Step 14', t.a.track.b.n, 149),
                            SEQ_TRACK('Step 15', t.a.track.b.o, 150),
                            SEQ_TRACK('Step 16', t.a.track.b.p, 151),
                        ]
                    },
                    {
                        name: 'Track 3',
                        controls: [
                            SEQ_TRACK('Step 1', t.a.track.c.a, 152),
                            SEQ_TRACK('Step 2', t.a.track.c.b, 153),
                            SEQ_TRACK('Step 3', t.a.track.c.c, 154),
                            SEQ_TRACK('Step 4', t.a.track.c.d, 155),
                            SEQ_TRACK('Step 5', t.a.track.c.e, 156),
                            SEQ_TRACK('Step 6', t.a.track.c.f, 157),
                            SEQ_TRACK('Step 7', t.a.track.c.g, 158),
                            SEQ_TRACK('Step 8', t.a.track.c.h, 159),
                            SEQ_TRACK('Step 9', t.a.track.c.i, 160),
                            SEQ_TRACK('Step 10', t.a.track.c.j, 161),
                            SEQ_TRACK('Step 11', t.a.track.c.k, 162),
                            SEQ_TRACK('Step 12', t.a.track.c.l, 163),
                            SEQ_TRACK('Step 13', t.a.track.c.m, 164),
                            SEQ_TRACK('Step 14', t.a.track.c.n, 165),
                            SEQ_TRACK('Step 15', t.a.track.c.o, 166),
                            SEQ_TRACK('Step 16', t.a.track.c.p, 167),
                        ]
                    },
                    {
                        name: 'Track 4',
                        controls: [
                            SEQ_TRACK('Step 1', t.a.track.d.a, 168),
                            SEQ_TRACK('Step 2', t.a.track.d.b, 169),
                            SEQ_TRACK('Step 3', t.a.track.d.c, 170),
                            SEQ_TRACK('Step 4', t.a.track.d.d, 171),
                            SEQ_TRACK('Step 5', t.a.track.d.e, 172),
                            SEQ_TRACK('Step 6', t.a.track.d.f, 173),
                            SEQ_TRACK('Step 7', t.a.track.d.g, 174),
                            SEQ_TRACK('Step 8', t.a.track.d.h, 175),
                            SEQ_TRACK('Step 9', t.a.track.d.i, 176),
                            SEQ_TRACK('Step 10', t.a.track.d.j, 177),
                            SEQ_TRACK('Step 11', t.a.track.d.k, 178),
                            SEQ_TRACK('Step 12', t.a.track.d.l, 179),
                            SEQ_TRACK('Step 13', t.a.track.d.m, 180),
                            SEQ_TRACK('Step 14', t.a.track.d.n, 181),
                            SEQ_TRACK('Step 15', t.a.track.d.o, 182),
                            SEQ_TRACK('Step 16', t.a.track.d.p, 183),
                        ]
                    },
                    
                ]
            },
            {
                height:2,
                width:8,
                tabs: [
                    {
                        name: "Name",
                        controls: [
                            NAME_CHAR("Char1", t.a.name.a, 184),
                            NAME_CHAR("Char2", t.a.name.b, 185),
                            NAME_CHAR("Char3", t.a.name.c, 186),
                            NAME_CHAR("Char4", t.a.name.d, 187),
                            NAME_CHAR("Char5", t.a.name.e, 188),
                            NAME_CHAR("Char6", t.a.name.f, 189),
                            NAME_CHAR("Char7", t.a.name.g, 190),
                            NAME_CHAR("Char8", t.a.name.h, 191),
                            NAME_CHAR("Char9", t.a.name.i, 192),
                            NAME_CHAR("Char10", t.a.name.j, 193),
                            NAME_CHAR("Char11", t.a.name.k, 194),
                            NAME_CHAR("Char12", t.a.name.l, 195),
                            NAME_CHAR("Char13", t.a.name.m, 196),
                            NAME_CHAR("Char14", t.a.name.n, 197),
                            NAME_CHAR("Char15", t.a.name.o, 198),
                            NAME_CHAR("Char16", t.a.name.p, 199),

                        ]
                    }
                ]
            }
        ]
    }
]

export {
    TetraRemote
};
export type { IRemote, ICategory as Category, ITab as Tab, IControl, ILayer as Layer};
