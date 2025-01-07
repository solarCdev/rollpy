<script lang="ts">
	import XIcon from '$lib/assets/xIcon.svelte';

	let { closeTab, child } = $props();
</script>

<div class="black">
	<button onclick={closeTab} class="close"><XIcon /></button>
	<div class="wrap">{@render child?.()}</div>
</div>

<style>
	.black {
		width: 100%;
		height: 100%;
		z-index: 9999;
		background-color: #111111cc;
		backdrop-filter: blur(30px);
		display: flex;
		top: 0;
		left: 0;
		position: fixed;
		box-sizing: border-box;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.close {
		display: flex;
		height: 48px;
		z-index: 99;
		justify-content: end;
		background: none;
		text-align: end;
	}
</style>
