<script>
    import * as R from 'ramda'
    import Patch from './Patch.svelte'
    import {openDatabase, PatchesStore, storePatch, deletePatch} from '../StateMachines/MidiSM'
    import Icon from 'fa-svelte'
    import {faPlusSquare as plus} from '@fortawesome/free-solid-svg-icons/faPlusSquare'
    import { programEditBuffer } from "../MIDI/MidiDevices";

    let newPatchName = "";
    let buffer = {}
    openDatabase();
    programEditBuffer.subscribe(newBuffer => buffer = newBuffer)

    function onLoadPatch({detail}) {
        console.log("load", detail)
        let patch = $PatchesStore[detail];
        if(patch) {
            programEditBuffer.set(patch)
        }
    }

    function onDeletePatch({detail}) {
        deletePatch(detail);
    }

    function onAddPatch() {
        storePatch(newPatchName, buffer);
        newPatchName = "";
    }
</script>

<style>
    .row {
        display: flex;
        flex-direction: row;
        padding: 5px;
    }

    button {
        height: 30px;
        width: 30px;
    }
</style>

<div class="row">
    <input type="text" bind:value={newPatchName}>
    <button disabled={newPatchName === ""}  on:click={onAddPatch}>
        <Icon icon={plus}/>
    </button>
</div>
{#each R.keys($PatchesStore) as name}
    <Patch {name} on:load={onLoadPatch} on:delete={onDeletePatch}/>
{/each}