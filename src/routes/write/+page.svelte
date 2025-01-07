<script lang="ts">
	import Writer from '$lib/components/writer.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';

	let { data }: { data: PageData } = $props();

	let type: boolean = $state(data?.type === 'team');
	let to: string | undefined = $state(data?.to ? data.to : undefined);

	onMount(() => {
		$titleOnTop = '';
		$currentNavBar = 'out';
	});
</script>

{#if data?.id}
	<Writer id={data.id} team={type} {to} />
{/if}
