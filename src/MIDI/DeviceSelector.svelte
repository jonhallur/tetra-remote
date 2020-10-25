<script>
    import * as R from 'ramda'
    export let label;
    export let defaultText;
    export let devices;
    export let onDeviceSelected;

    function optionDisabled(device) {
        let connectionOpen = R.propEq('connection', 'open', device);
        let stateConnected = R.propEq('state', 'connected', device);
        return connectionOpen || !stateConnected
    }
</script>

<div class="selector">
    <label for="remoteInput">{label}</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select name="remoteInput" id="remoteInput" on:change={onDeviceSelected}>
        <option disabled selected>{defaultText}</option>
        <optgroup>
            {#each devices as input}
            <option value={input.id} disabled={optionDisabled(input)}>{input.manufacturer} - {input.name}</option>
            {/each}
        </optgroup>
    </select>
</div>

<style>
    .selector {
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        max-width: 125px;
    }
</style>