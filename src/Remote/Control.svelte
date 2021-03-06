<script lang="ts">
    export let control : IControl;
    import {createEventDispatcher, getContext} from 'svelte';
    import * as R from 'ramda';
    import type { IControl } from '../Data/RemoteDefs';
    const dispatch = createEventDispatcher();
    const { getLeftButtonState, setPresser, getPresser } = getContext("LeftMouseButton");

    function setNewValue(newValue: string|number) {
        let value : number;
        if (typeof newValue === 'string')
            value = parseInt(newValue, 10);
        else
            value = newValue;
        dispatch('updated', value);
    }

    function handleChange({currentTarget: {value}}) {
        setNewValue(value)
    }

    function handleScroll({deltaY}) {
        let currentValue;
        let {min, max, current} = control;
        let change = deltaY > 0 ? -1 : 1;
        if(typeof current === 'string')
            currentValue = parseInt(current, 10)
        else
            currentValue = current
        let withChange = currentValue + change;
        if(withChange > max - min || withChange < 0) {
            return;
        }
        setNewValue(withChange);
    }

    function handleClick({offsetX, currentTarget:{clientWidth} }) {
        console.log("handle click")
        handlePosition({offsetX, currentTarget:{clientWidth} })
    }

    function handlePosition({offsetX, currentTarget:{clientWidth}}) {
        let {min, max} = control
        let percentage = offsetX / clientWidth;
        let range = max - min
        let newValue = Math.round(range * percentage);
        setNewValue(newValue);
    }

    function currentControlValueInPct(control) {
        let value = parseInt(control.current, 10);
        let {min, max} = control
        let range = max - min;
        return Math.round((value/range)*100)
    }

    function handleDrag({offsetX, currentTarget:{clientWidth}}) {
        if(getLeftButtonState() && getPresser() === this)
            handlePosition({offsetX, currentTarget: {clientWidth}})
    }

    function handleMouseDown() {
        setPresser(this);
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
    value-nrpn={control.nrpn}
    value-key={control.key}
    on:wheel|preventDefault={handleScroll}
    >
    <!-- svelte-ignore a11y-no-onchange -->
    <div 
        class="control-inner"
        on:mousemove={handleDrag}
        on:mousedown={handleMouseDown}
        on:click|preventDefault={handleClick}
    >
        <p 
            class="control-label" 
        >{control.label}</p>
        <select 
            name="{control.key}" 
            id="{control.key}" 
            on:change|preventDefault={handleChange}
            on:mousemove={(e) => e.stopPropagation()}
            on:click={(e) => e.stopPropagation()}
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