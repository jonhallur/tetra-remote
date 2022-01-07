<script lang="ts">
    import * as R from 'ramda';
    import Modal from '../Layout/Modal.svelte';
    import { TetraRemote, ControlType } from '../Data/RemoteDefs';
    import { programEditBuffer, programLoadBuffer, sendNRPN } from "../MIDI/MidiDevices";
    import type { IRemote, Layer, Category, Tab, IControl } from '../Data/RemoteDefs';
    import { Tabs, TabList, TabPanel, Tab as TabTitle } from '../Layout/tabs';
    import ControlLayout from './Control.svelte';
    let currentPatchName = "Default_patch";
    let currentRemote : IRemote = R.clone(TetraRemote);
    let bufferToSend = [];
    let bufferLength = 0;
    let sendDelay = 10;
    const forIndexed = R.addIndex(R.forEach);
    const zipToPath = (param : Array<string|number>, idxPath : Array<string|number>) => R.flatten(R.zip(idxPath, param))
    const controlPath = ['categories', 'tabs', 'controls', 'current'];
    const SplitLens = R.lensPath([...zipToPath(controlPath, [2,0,0]), 0]);
    const KeyModeLens = R.lensPath([...zipToPath(controlPath, [2,0,0]), 1]);
    type controlFunc = (layerIdx: number, categoryIdx: number, tabIdx: number, controlIdx: number, control : IControl) => void;

    function doToEachControl(func : controlFunc, currentRemote : IRemote) {
        forIndexed((layer : Layer, layerIdx) => {
            forIndexed((category : Category, categoryIdx) => {
                forIndexed((tab : Tab, tabIdx) => {
                    forIndexed((control: IControl, controlIdx) => {
                        func(layerIdx, categoryIdx, tabIdx, controlIdx, control);
                    }, tab.controls);
                }, category.tabs)
            }, layer.categories)
        }, currentRemote)
    }

    function updateValue(value: number, path: Array<number>, control: IControl) {
        let currentValuePath = zipToPath(controlPath, path);

        currentRemote = R.set(R.lensPath(currentValuePath), value, currentRemote);
        let {nrpn, min} = control;
        sendNRPN(nrpn, value + min)
        programEditBuffer.set(R.set(R.lensProp(control.key), value + min, $programEditBuffer))
    }

    function sendFirstFromBuffer() {
        if(bufferToSend && R.length(bufferToSend) > 0) {
            let [nrpn, value] = R.head(bufferToSend);
            bufferToSend = R.tail(bufferToSend);
            setTimeout(() => {
                sendNRPN(nrpn, value);
                sendFirstFromBuffer();
            }, sendDelay)
        }
        else {
            programEditBuffer.set($programLoadBuffer)
        }
    }

    function getNameFromBuffer(buffer) {
        let letters = R.map(String.fromCharCode, R.range(97, 113));
        let nameKeys = R.map((letter) => R.join('.', ['global.name', letter]), letters);
        let nameValues = R.map((key) => buffer[key] ,nameKeys)
        if(R.all(R.isNil, nameValues)) {
            return "Default Patch"
        }
        else {
            let nameChars = R.map((char) => String.fromCharCode(char), nameValues)
            return R.join('', nameChars);
        }
    }

    function onNameChanged() {
        let prevName = getNameFromBuffer($programEditBuffer);
        let charArr = R.take(16, R.split('', currentPatchName));
        let corrected = R.join('', charArr);
        if(R.equals(prevName, corrected)) {
            console.log("is same")
        } else {
            let hasChanges = R.map(index => {
                return R.equals(charArr[index], R.split('', prevName)[index])
            }, R.range(0, 16))
            forIndexed((val, idx) => {
                if(!val) {
                    let changedLetter = charArr[idx];
                    if(R.isNil(changedLetter))
                        changedLetter = ' ';
                    let charCode = changedLetter.charCodeAt(0);
                    let asZeroVal = charCode - 32;
                    let path = [2,0,0,2 + idx];
                    let letterControl : IControl = R.path([...zipToPath(controlPath, [2,0,0]), 2+idx], currentRemote);
                    updateValue(asZeroVal, path, letterControl);
                }
            }, hasChanges)
        }
        currentPatchName = corrected;
    }
    
    programEditBuffer.subscribe((buffer :IRemote) => {
        bufferToSend = [];
        doToEachControl((layerIdx, categoryIdx, tabIdx, controlIdx, control) => {
            let value = buffer[control.key];
            if (value !== undefined) {
                let currentValuePath = zipToPath(controlPath, [layerIdx, categoryIdx, tabIdx, controlIdx]);
                currentRemote = R.set(R.lensPath(currentValuePath), value - control.min, currentRemote);
            }
        }, currentRemote)
        currentPatchName = getNameFromBuffer(buffer);
    })

    programLoadBuffer.subscribe((buffer :IRemote) => {
        bufferToSend = [];
        doToEachControl((layerIdx, categoryIdx, tabIdx, controlIdx, control) => {
            let value = buffer[control.key];
            if (value !== undefined) {
                let currentValuePath = zipToPath(controlPath, [layerIdx, categoryIdx, tabIdx, controlIdx]);
                currentRemote = R.set(R.lensPath(currentValuePath), value - control.min, currentRemote);
                bufferToSend.push([control.nrpn, value]);
            }
        }, currentRemote)
        bufferLength = R.length(bufferToSend);
        sendFirstFromBuffer();
    })

    

    doToEachControl((layerIdx, categoryIdx, tabIdx, controlIdx, control) => {
        let currentValuePath = zipToPath(controlPath, [layerIdx, categoryIdx, tabIdx, controlIdx]);
        currentRemote = R.set(R.lensPath(currentValuePath), control.default, currentRemote);
    }, currentRemote)
</script>



<style>
    .controls {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .categories {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: clip;
    }

    .category {
        border: solid 1px black;
        margin: 5px;
        background-color: lightgray;
        overflow: hidden;
    }

    .category-height-1 {
        height: 85px;
    }

    .category-height-2 {
        height: 140px;
    }

    .category-width-2 {
        width: 176px;
    }

    .category-width-3 {
        width: 264px;
    }

    .category-width-4 {
        width: 312px;
    }

    .category-width-5 {
        width: 390px;
    }

    .category-width-6 {
        width: 468px;
    }
    .category-width-8 {
        width: 624px;
    }

    .tab-label {
        margin: 0;
        padding-left: 5px;
        font-weight: 700;
    }

    .layer-label {
        font-weight: 600;
        margin: 0;
        padding-left: 5px;
        font-size: larger;
    }

    .patchNameInput {
        font-family: monospace;
        margin-left: 5px;
        width: 145px;

    }
</style>

<Modal
    show={!R.isEmpty(bufferToSend)} 
    title={`Loading patch ${bufferLength - R.length(bufferToSend)} / ${bufferLength}`}
>
    <progress max={bufferLength} value={bufferLength - R.length(bufferToSend)}></progress>
</Modal>

<div class="categories">
    <input class="patchNameInput" type="text" bind:value={currentPatchName} on:input={onNameChanged} />
</div>
<div class="categories">
    {#each [R.view(SplitLens, currentRemote), R.view(KeyModeLens, currentRemote)] as control, idx}
    <ControlLayout 
        {control}
        on:updated={(evt) => 
            updateValue(evt.detail, [2, 0, 0, idx], control)
        }
    />
    {/each}
</div>

<Tabs>
    <TabList>
        {#each R.take(2, currentRemote) as layer}
            <TabTitle>{layer.name}</TabTitle>
        {/each}
    </TabList>

{#each R.take(2, currentRemote) as layer, layerIdx}
<TabPanel>
    <div class="layer">
        <div class="categories">
            {#each layer.categories as category, categoryIdx}
            <div class="category category-height-{category.height} category-width-{category.width}">
            <Tabs>
                <TabList>
                {#each category.tabs as tab, tabIdx}
                    <TabTitle>{tab.name}</TabTitle>
                {/each}
                </TabList>
                {#each category.tabs as tab, tabIdx}
                <TabPanel>
                <div class="controls">
                    {#each tab.controls as control, controlIdx}
                        <ControlLayout {control} on:updated={(evt) => 
                            updateValue(evt.detail, [layerIdx, categoryIdx, tabIdx, controlIdx], control)
                        }
                        />
                    {/each}
                </div>
                </TabPanel>
                {/each}
            </Tabs>
            </div>
            {/each}
        </div>
    </div>
</TabPanel>
{/each}
</Tabs>
