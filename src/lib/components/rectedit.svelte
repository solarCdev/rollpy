<script lang="ts">
	import { type ModifierParams } from '$lib/generators';
	let { canvas, modifier } = $props();

	let color: string = $state(canvas?.getActiveObject()?.get('fill'));

	$effect(() => {
		let params: ModifierParams = { color: color };
		modifier(params);
	});
</script>

<div>
	<input type="color" bind:value={color} />
</div>
