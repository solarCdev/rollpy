<script>
	import ArrowIcon from '$lib/assets/arrowIcon.svelte';
</script>

<button
	onclick={() => {
		window.history.back();
	}}><ArrowIcon /></button
>

<style>
	button {
		width: 32px;
		height: 32px;
		padding: 0;
		border-radius: 0;
		background: none;
	}
</style>
