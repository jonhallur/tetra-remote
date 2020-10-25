<script>
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	export let fgColor = 'white';
	export let bgColor = 'lightslategray';
	const tab = {};
	const { registerTab, selectTab, selectedTab } = getContext(TABS);
	let style = '';
	$: {
		style = `background-color: ${bgColor}; color: ${fgColor}`
	}
	registerTab(tab);
</script>

<style>
	button {
		background: none;
		border: none;
		border-radius: 0;
		margin: 0;
        color: #444;
        padding: 5px
    }
    
    button:focus {
        outline: none;
    }
</style>

<button style={$selectedTab === tab ? style : ''} on:click="{() => selectTab(tab)}">
	<slot></slot>
</button>