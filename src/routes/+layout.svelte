<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { onMount } from 'svelte';
	import { auth } from '$lib/fbase';
	import BasicNavBar from '$lib/components/basicNavBar.svelte';
	import { writable } from 'svelte/store';
	import { toggleSetting } from '$lib/currentNavBar';
	import Tab from '$lib/components/tab.svelte';
	import PaperSetter from '$lib/components/paperSetter.svelte';

	let loading: boolean = $state(true);

	onMount(async () => {
		await auth.authStateReady();

		const loggedIn = !!auth.currentUser && auth.currentUser?.emailVerified;
		loading = false;
	});
</script>

{#if loading}
	<div class="loading">
		<h1>Rollpy</h1>
	</div>
{:else}
	{#if $toggleSetting}
		<Tab
			closeTab={() => {
				$toggleSetting = false;
			}}>{#snippet child()}<PaperSetter />{/snippet}</Tab
		>
	{/if}
	<BasicNavBar />
	{@render children()}
{/if}

<style>
	.loading {
		display: flex;
		position: fixed;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		left: 0;
		top: 0;
	}
</style>
