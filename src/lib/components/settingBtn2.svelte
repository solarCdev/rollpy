<script lang="ts">
	import SettingIcon from '$lib/assets/settingIcon.svelte';
	import { paperstatus, toggleSetting } from '$lib/currentNavBar';
	import { auth } from '$lib/fbase';
	import { onMount } from 'svelte';
	import Tab from './tab.svelte';

	let show = $state(false);

	onMount(() => {
		show = $paperstatus.creator === auth.currentUser?.uid;
	});
</script>

{#if show}
	<button
		onclick={() => {
			$toggleSetting = true;
		}}><SettingIcon /></button
	>
{/if}

<style>
	button {
		width: 32px;
		height: 32px;
		background: none;
		padding: 0;
	}

	button:hover {
		background: none;
	}
</style>
