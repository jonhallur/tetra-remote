<script lang="ts">
    export let name: string;

    import Icon from 'fa-svelte'
    import {faFileImport} from '@fortawesome/free-solid-svg-icons/faFileImport'
    import {faTrashAlt} from '@fortawesome/free-solid-svg-icons/faTrashAlt'
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    let allowEdit = false;
</script>

<style>
    .patch {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        white-space: nowrap;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .col-3 {
        flex-grow: 3;
        height: 24px;
        display: inline-block; /*Display inline and maintain block characteristics.*/
        vertical-align: top; /*Makes sure all the divs are correctly aligned.*/
        white-space: normal; /*Prevents child elements from inheriting nowrap.*/
        width: 120px;
    }

    .col-1 {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        align-items: flex-end;
    }
</style>

<div class="patch">
    <div class="col-3">
        {name}
    </div>
    <div class="col-1">
        <button on:click={() => dispatch('load', name)}>
            <Icon icon={faFileImport} ></Icon>
        </button>
        <button on:click={() => dispatch('delete', name)}>
            <Icon icon={faTrashAlt}></Icon>
        </button>
    </div>
</div>