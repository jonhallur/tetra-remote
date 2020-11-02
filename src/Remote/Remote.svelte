<script lang="ts">
    import * as R from 'ramda';
    import { TetraRemote } from '../Data/RemoteDefs';
    import { programEditBuffer, sendNRPN } from "../MIDI/MidiDevices";
    import type { IRemote, Layer, Category, Tab, IControl } from '../Data/RemoteDefs';
    import { Tabs, TabList, TabPanel, Tab as TabTitle } from '../Layout/tabs';
    import ControlLayout from './Control.svelte';
    let currentRemote : IRemote = R.clone(TetraRemote);
    let bufferToSend = [];
    let bufferLength = 0;
    let sendDelay = 10;
    const forIndexed = R.addIndex(R.forEach);
    const zipToPath = (param : Array<string|number>, idxPath : Array<string|number>) => R.flatten(R.zip(idxPath, param))
    const controlPath = ['categories', 'tabs', 'controls', 'current'];
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
            console.log("hide")
        }
    }
    
    programEditBuffer.subscribe((buffer :IRemote) => {
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
    }

    .category {
        border: solid 1px black;
        margin: 5px;
        background-color: lightgray;
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

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
        border: 1px solid green;
        width: 100%;
        height: 100%;
        background-color: rgba(30, 30, 30, 0.9);
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .bar {
        color: white;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -50px;
        margin-left: -50px;
        width: 300px;
        height: 50px;
    }
</style>
<div class="modal" style={R.isEmpty(bufferToSend) ?  'display: none' : 'display: block'}>
    <div class="bar">
        <p>Loading patch  {bufferLength - R.length(bufferToSend)} / {bufferLength}</p>
        <progress max={bufferLength} value={bufferLength - R.length(bufferToSend)}></progress>
    </div>
</div>

<Tabs>
    <TabList>
        {#each currentRemote as layer}
            <TabTitle>{layer.name}</TabTitle>
        {/each}
    </TabList>

{#each currentRemote as layer, layerIdx}
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
