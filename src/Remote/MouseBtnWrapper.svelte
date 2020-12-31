<script lang="ts">
    import { setContext } from 'svelte'

    let leftMouseButtonState = false;
    let buttonPresser = null;

    setContext("LeftMouseButton", {
        getLeftButtonState: () => leftMouseButtonState,
        setPresser: (presser) => buttonPresser = presser,
        getPresser: () => buttonPresser
    })

function setLeftButtonState({buttons} : MouseEvent) {
    leftMouseButtonState = buttons === 1;
}

</script>

<div
    on:mousedown={setLeftButtonState}
    on:mouseup={setLeftButtonState}
>
    <slot/>
</div>