<script>
    import {
        useMidi, midiInputs, midiOutputs, selectRemoteInput, selectRemoteOutput, selectControllerInput,
        controllerChannelStore, remoteChannelStore, selectControllerChannel, selectRemoteChannel
    } from './MidiDevices'
    import DeviceSelector from './DeviceSelector.svelte'
    import ChannelSelector from './ChannelSelector.svelte'
    import {hasFullDuplexMidi, requestSysExDump} from './MidiDevices'

    import * as R from 'ramda'

    const onInputSelected = ({target:{value}}) => selectRemoteInput(value);
    const onOutputSelected = ({target:{value}}) => selectRemoteOutput(value);
    const onControllerSelected = ({target:{value}}) => selectControllerInput(value);
    const onRemoteChannelChange = ({target: {value}}) => selectRemoteChannel(value);
    const onControllerChannelChange = ({target:{value}}) => selectControllerChannel(value);

</script>

<div use:useMidi class="selector-box">
    <DeviceSelector 
        label="Tetra input" 
        defaultText="Select remote input"
        devices={$midiInputs}
        onDeviceSelected={onInputSelected} 
    />
    <DeviceSelector
        label="Tetra output"
        defaultText="Select remote output"
        devices={$midiOutputs}
        onDeviceSelected={onOutputSelected}
    />
    <ChannelSelector
        channelValue={$remoteChannelStore}
        onChannelChange={onRemoteChannelChange}
    />
    <DeviceSelector
        label="Controller input"
        defaultText="Select controller input"
        devices={$midiInputs}
        onDeviceSelected={onControllerSelected}
    />
    <ChannelSelector
        channelValue={$controllerChannelStore}
        onChannelChange={onControllerChannelChange}
    />
    <div class="buttonContainer">
        <button disabled={!$hasFullDuplexMidi} on:click={() => requestSysExDump()}>Request Patch</button>
    </div>
</div>

<style>
    .selector-box {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow: hidden;
        align-items: center;
    }

    .buttonContainer {
        margin: 0 25px;
    }

    button {
        height: 24px;
        width: 125px;
        display: block;
        font-size: 10px;
        font-family: sans-serif;
        color: #444;
        line-height: 1.3;
        padding: .2em 0.4em .2em .4em;
        box-sizing: border-box;
        border: 1px solid #aaa;
        box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
        border-radius: .5em;
        background-color: #fff;
        appearance: none;
        background-image: linear-gradient(to bottom, #ffffff 0%,#c5c5c5 100%);
        background-repeat: no-repeat, repeat;
        background-position: 0 0;
        background-size: 100%;
    }

    button:disabled {
        border: 1px solid #eee;
        background-color: lightgray;
        color: #ccc;
        background-image: linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
    }
</style>