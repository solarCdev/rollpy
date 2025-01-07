<script lang="ts">
	import { onMount, unmount } from 'svelte';

	let { message } = $props();

	let nodeRef: HTMLDivElement;
	onMount(() => {
		setTimeout(() => {
			try {
				nodeRef.parentNode?.removeChild(nodeRef);
			} catch (err) {}
		}, 2000);
	});
</script>

<div class="toast" bind:this={nodeRef}>
	<span>{message}</span>
</div>

<style>
	.toast {
		position: fixed;
		background-color: #111;
		top: 24px;
		width: 240px;
		z-index: 10;
		padding: 16px;
		border-radius: 12px;
		left: 50%;
		transform: translateX(-50%);
		border: 1px solid #242424;
	}
</style>
