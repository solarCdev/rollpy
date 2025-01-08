<script>
	import ArrowIcon from '$lib/assets/arrowIcon.svelte';
</script>

<button
	onclick={() => {
		console.log(history.length);
		if (history.length === 0) {
			window.location.href = '/';
		}
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
