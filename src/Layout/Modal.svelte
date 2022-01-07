<script lang="ts">

import Icon from 'fa-svelte'
    import {faCheckCircle} from '@fortawesome/free-solid-svg-icons/faCheckCircle'
    import {faTimesCircle} from '@fortawesome/free-solid-svg-icons/faTimesCircle'

    export let show: boolean = false;
    export let title: string = "";
    export let yesNo: boolean = false;
    export let onConfirm = () => {};
    export let onCancel = () => {};
</script>

<style>
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

    .window {
        --padding: 10px;
        --halfWidth: 100px;
        --halfHeight: 50px;
        padding: var(--padding);
        border: 1px solid navajowhite;
        border-radius: 5px;
        background-color: lightslategray;
        color: white;
        text-align: center;
        position: absolute;
        top: calc(50% -  var(--halfHeight) - var(--padding));
        left: calc(50% - var(--halfWidth) - var(--padding));
        width: calc(var(--halfWidth) + var(--halfWidth));
        height: calc(var(--halfHeight) + var(--halfHeight));
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .buttons {
        --rowHeight: 30px;
        height: var(--rowHeight);
    }

    button {
        height: 30px;
        width: 30px;
    }

    .content {
        height: calc(100% - 21px - var(--padding) - var(--rowHeight));
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
<div class="modal" style={`display: ${show ? 'block' : 'none'}`}>
    <div class="window">
        <p>{title}</p>
        <div class="content">
            <slot></slot>
        </div>
        <div class="buttons">
            {#if yesNo}
            <button on:click={() => {
                onConfirm();
            }}>
                <Icon icon={faCheckCircle}></Icon>
            </button>
            <button on:click={() => {
                onCancel();
            }}>
                <Icon icon={faTimesCircle} ></Icon>
            </button>
            {/if}
        </div>
    </div>
</div>