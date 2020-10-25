<script lang="ts">
    import * as R from 'ramda';
    import { TetraRemote } from '../RemoteDefs';
    import { programEditBuffer, sendNRPN } from "../MIDI/MidiDevices";
    import type { IRemote, Layer, Category, Tab, IControl } from '../RemoteDefs';
    import { Tabs, TabList, TabPanel, Tab as TabTitle } from '../Layout/tabs';
    import ControlLayout from './Control.svelte';
    import type { LAYERA_AMP_Attack } from '../LayerA_Names';
    let currentRemote : IRemote = R.clone(TetraRemote);
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
        let {nrpn} = control;
        sendNRPN(nrpn, value)
    }
    
    programEditBuffer.subscribe((buffer :IRemote) => {
        doToEachControl((layerIdx, categoryIdx, tabIdx, controlIdx, control) => {
            let value = buffer[control.key];
            if (value !== undefined) {
                let currentValuePath = zipToPath(controlPath, [layerIdx, categoryIdx, tabIdx, controlIdx]);
                currentRemote = R.set(R.lensPath(currentValuePath), value, currentRemote);
            }
        }, currentRemote)
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
        width: 352px;
    }

    .category-width-5 {
        width: 440px;
    }

    .category-width-6 {
        width: 528px;
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

</style>

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