<script lang="ts">
    export let control : IControl;
    import {createEventDispatcher} from 'svelte';
    import * as R from 'ramda';
    import type { IControl } from '../Data/RemoteDefs';
    const dispatch = createEventDispatcher();

    function setNewValue(newValue: string|number) {
        let value : number;
        if (typeof newValue === 'string')
            value = parseInt(newValue, 10);
        else
            value = newValue;
        dispatch('updated', newValue);
    }

    function handleChange({currentTarget: {value}}) {
        setNewValue(value)
    }

    function handleScroll({deltaY}) {
        let {min, max, current} = control;
        let change = deltaY > 0 ? -1 : 1;
        let withChange = current + change;
        if(withChange > max || withChange < min) {
            return;
        }
        setNewValue(withChange);
    }

    function handleClick({offsetX, currentTarget:{clientWidth} }) {
        let percentage = offsetX / clientWidth;
        let range = R.length(control.values) - 1;
        let newValue = Math.round(range * percentage);
        setNewValue(newValue);
    }

    function currentControlValueInPct(control) {
        let value = parseInt(control.current, 10);
        let maxVal = R.length(control.values) - 1;
        return Math.round((value/maxVal)*100)
    }
</script>

<style>
    .control {
        position: relative;
        width: 65px;
        height: 45px;
        border: solid 1px black;
        margin: 5px;
        background-color: lightslategray;
    }

    .control-label {
        font-size: small;
        user-select: none;
        text-align: center;
        color: white;
        padding: 0;
        margin: 0;
    }

    .control-inner {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .value-bar {
        position: relative;
        background-color: darkslategrey;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
    }
</style>

<div class="control"
    on:wheel|preventDefault={handleScroll}
    >
    <!-- svelte-ignore a11y-no-onchange -->
    <div class="control-inner">
        <p class="control-label" on:click|preventDefault={handleClick}>{control.label}</p>
        <select 
            name="{control.key}" 
            id="{control.key}" 
            on:change|preventDefault={handleChange}
            bind:value={control.current}
            >
            <optgroup>
            {#each control.values as value, index}
                <option value={index} >{value}</option>
            {/each}
            </optgroup>
        </select>
    </div>
    <div class="value-bar" style="width:{currentControlValueInPct(control)}%;"></div>
</div>