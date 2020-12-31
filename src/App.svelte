<script lang="ts">
    import * as R from 'ramda'
    import MidiSelector from './MIDI/MidiSettings.svelte'
    import Remote from './Remote/Remote.svelte'
    import MouseBtnWrapper from './Remote/MouseBtnWrapper.svelte'
    import StoredPatches from './Aside/StoredPatches.svelte'
</script>


<main class="mother">
    <div class="header">
        <MidiSelector></MidiSelector>
    </div>
    <div class="main-row">
        <div class="aside">
            <StoredPatches />
        </div>
        <div class="main">
            <MouseBtnWrapper>
                <Remote />
            </MouseBtnWrapper>
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
        height: 100px;
    }
	.aside {
        border-right: 1px solid lightslategray;
    }
    .main-row {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
    .main {
        overflow: scroll;
    }
</style>