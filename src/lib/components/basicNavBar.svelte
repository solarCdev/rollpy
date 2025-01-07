<script lang="ts">
	import type { Component } from 'svelte';
	import BackBtn from './backBtn.svelte';
	import Rollpy from '$lib/assets/rollpy.svelte';
	import Profile from './profile.svelte';
	import SettingBtn from './settingBtn.svelte';
	import { type Readable } from 'svelte/store';
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';
	import SettingBtn2 from './settingBtn2.svelte';

	const comp = {
		out: { left: BackBtn, right: null },
		basis: { left: Rollpy, right: Profile },
		mypage: { left: BackBtn, right: SettingBtn },
		paper: { left: BackBtn, right: SettingBtn2 }
	};

	// let Left: Readable<Component | null> = derived(currentNavBar, (v) => comp[v].left);
	// let Right: Readable<Component | null> = derived(currentNavBar, (v) => comp[v].right);

	let Left = $derived(comp[$currentNavBar].left);
	let Right = $derived(comp[$currentNavBar].right);
</script>

<!-- {$titleOnTop} -->
<nav>
	<Left />
	{#if $currentNavBar !== 'basis'}<h2>{$titleOnTop}</h2>{/if}
	{#if Right !== null}<Right />{:else}
		<div class="null"></div>{/if}
</nav>
<div class="space"></div>

<style>
	nav {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		height: 56px;
		display: flex;
		padding: 4px 20px 4px 20px;
		align-items: center;
		justify-content: space-between;
		background-color: #111111cc;
		backdrop-filter: blur(40px);
		z-index: 1000;
	}

	h2 {
		font-size: 20px;
	}

	.null {
		width: 32px;
	}

	.space {
		height: 80px;
	}
</style>
