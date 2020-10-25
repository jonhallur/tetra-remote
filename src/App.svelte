<script lang="ts">
    import MidiSelector from './MIDI/MidiSettings.svelte'
    import Remote from './Remote/Remote.svelte'
</script>

<main class="mother">
    <div class="header">
        <MidiSelector></MidiSelector>
    </div>

    <div class="main-row">
        <div class="aside">
            aside
        </div>
        <div class="main">
            <Remote />
        </div>
    </div>
    <div class="footer">footer</div>
</main>

<style>
	.mother {
		height: 100vh;
        display: flex;
        flex-direction: column;
	}
	.header {
        height: 100px;
        display: flex;
        flex-direction: row;

    }
    .footer {
        background-color: pink;
        height: 300px;
    }
	.aside {
        width: 14em;
        background-color: lightcoral;
    }
    .main-row {
        flex: 1;
        display: flex;
        overflow: scroll;
    }
</style>