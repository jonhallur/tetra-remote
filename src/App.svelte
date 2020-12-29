<script lang="ts">
    import * as R from 'ramda'
    import { setContext } from 'svelte'
    import MidiSelector from './MIDI/MidiSettings.svelte'
    import Remote from './Remote/Remote.svelte'
    import StoredPatches from './Aside/StoredPatches.svelte'

    let leftMouseButtonState = false;

    setContext("LeftMouseButton", {
        getLeftButtonState: () => leftMouseButtonState
    })

    function setLeftButtonState({buttons} : MouseEvent) {
        leftMouseButtonState = buttons === 1;
    }
</script>


<main class="mother">
    <div class="header">
        <MidiSelector></MidiSelector>
    </div>
    <div class="main-row">
        <div class="aside">
            <StoredPatches />
        </div>
        <div 
            class="main" 
            on:mousedown={setLeftButtonState}
            on:mouseup={setLeftButtonState}
            on:mousemove={setLeftButtonState}
        >
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
        height: 100px;
    }
	.aside {
        
    }
    .main-row {
        flex: 1;
        display: flex;
        overflow: scroll;
    }
</style>