<script>
    import * as R from 'ramda'
    import Patch from './Patch.svelte'
    import {openDatabase, PatchesStore, storePatch, deletePatch} from '../StateMachines/MidiSM'
    import Icon from 'fa-svelte'
    import {faSave as saveIcon} from '@fortawesome/free-solid-svg-icons/faSave'
    import {faFileUpload as loadIcon} from '@fortawesome/free-solid-svg-icons/faFileUpload'
    import { programEditBuffer, programLoadBuffer } from "../MIDI/MidiDevices";

    let newPatchName = "";
    openDatabase();

    function onLoadPatch({detail}) {
        let patch = $PatchesStore[detail];
        if(patch) {
            programLoadBuffer.set(patch)
        }
    }

    function onDeletePatch({detail}) {
        if(window.confirm("Delete patch"))
            deletePatch(detail);
    }

    function onAddPatch() {
        storePatch(newPatchName, $programEditBuffer);
        newPatchName = "";
    }

    function onExportPatch({detail}) {
        let patch = $PatchesStore[detail];
        if(patch) {
            let element = document.createElement('a');
            let text = JSON.stringify(patch, null, 2)
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', detail + '.tetraPatch');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } 

    }

    function onImportPatch() {
        console.log("import")
        let element = document.createElement('input');
        element.setAttribute('type', 'file');
        element.setAttribute('accept', '.tetraPatch');
        element.style.display = 'none';
        element.addEventListener('change', (evt) => {
            let lens = R.lensPath(['target', 'files', 0])
            let file = R.view(lens, evt);
            if(file) {
                const reader = new FileReader();
                reader.addEventListener('load', (event) => {
                    let {target: {result}} = event
                    let fileData = JSON.parse(result);
                    let fileName = R.head(R.split('.', file.name))
                    storePatch(fileName, fileData);
                });
                reader.readAsText(file);
            }
        })
        document.body.appendChild(element);
        element.click();
    }
</script>

<style>
    .row {
        display: flex;
        flex-direction: row;
        padding: 5px;
        width: 200px;
    }

    button {
        height: 30px;
        width: 30px;
    }
</style>

<div class="row">
    <input type="text" bind:value={newPatchName}>
    <button disabled={newPatchName === ""}  on:click={onAddPatch}>
        <Icon icon={saveIcon}/>
    </button>
    <button on:click={onImportPatch}>
        <Icon icon={loadIcon}/>
    </button>
</div>
{#each R.keys($PatchesStore) as name}
    <Patch {name} on:load={onLoadPatch} on:delete={onDeletePatch} on:export={onExportPatch}/>
{/each}