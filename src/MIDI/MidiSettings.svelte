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
</style>