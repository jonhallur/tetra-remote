<script>
    export let channelValue
    export let onChannelChange
</script>

<div class="channel-selector">
    <label for="remoteChannel">Channel</label>
    <input 
        value={channelValue} on:change={onChannelChange}
        type="number" id="remoteChannel" name="quantity" min="1" max="16">   
</div>

<style>
    .channel-selector {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
</style>