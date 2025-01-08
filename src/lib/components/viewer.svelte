<script lang="ts">
	import { downloadCanvas, renderCanvas } from '$lib/canvasControl';
	import { Canvas, FabricImage, util } from 'fabric';
	import { onMount } from 'svelte';
	import { downloadAllWebfont } from '$lib/webfontDownloader';
	import type { DocumentData } from 'firebase/firestore';
	import Tab from './tab.svelte';
	import Share from './share.svelte';
	import type { Paper } from '$lib/getPaperList';
	import XIcon from '$lib/assets/xIcon.svelte';
	import ArrowIcon from '$lib/assets/arrowIcon.svelte';
	import ArrowRevIcon from '$lib/assets/arrowRevIcon.svelte';

	// let { team, id, arrange }: { team: boolean; id: string; arrange: string } = $props();

	let canvas: Canvas | undefined = $state();
	let canvasEle: HTMLCanvasElement;

	const {
		info,
		prev,
		next,
		single,
		closeTab
	}: {
		info: Paper;
		prev: () => number | null;
		next: () => number | null;
		single: boolean;
		closeTab: () => void;
	} = $props();

	const date = new Date(info.createdAt).toJSON().slice(0, 10).replace(/-/g, '/');
	const time = new Date(info.createdAt).toJSON().slice(11, 16).replace(/-/g, '/');
	let dateFormat: string = $state(date + time);

	let prevA: boolean = $state(true);
	let nextA: boolean = $state(true);

	onMount(async () => {
		canvas = renderCanvas({
			canvasEle,
			backgroundColor: 'black',
			backgroundImg: undefined
		});
		downloadAllWebfont();

		await canvas.loadFromJSON(info?.canvas, () => {});
		util.requestAnimFrame(function render() {
			canvas?.renderAll();
			util.requestAnimFrame(render);
		});
		let idx = 0;

		canvas?.forEachObject((obj) => {
			obj.selectable = false;
			if (obj.isType('image')) {
				const img = obj as FabricImage;
				let imgEle = img.getElement() as HTMLImageElement;
				if (!imgEle.src) {
					const gif = document.createElement('video');
					const gifSource = document.createElement('source');
					gif.id = info?.source[idx].src;
					gif.width = info?.source[idx].width;
					gif.height = info?.source[idx].height;
					gif.muted = true;
					gifSource.src = info?.source[idx].src;
					gif.autoplay = true;
					gif.loop = true;
					gif.appendChild(gifSource);
					img.setElement(gif);
					gif.play();
					idx++;
				}
			}
		});
	});
</script>

<div class="wrap">
	<div class="x-wrap">
		<h1>{info.creator}</h1>
		<button onclick={closeTab} class="close"><XIcon /></button>
	</div>

	<canvas bind:this={canvasEle} width="324px" height="576px"></canvas>

	<div class="toolbar">
		{#if !single}
			<div class="btn-wrap">
				<button
					onclick={() => {
						prevA = prev() !== null;
					}}><ArrowIcon /></button
				>
				<button
					class={nextA ? 'disabled' : ''}
					disabled={nextA ? false : true}
					onclick={() => {
						nextA = next() !== null;
					}}><ArrowRevIcon /></button
				>
			</div>
		{/if}
		{#if info.createdAt}
			<p>Created at {dateFormat}</p>
		{/if}
	</div>
</div>

<style>
	.wrap {
		width: 100%;
		height: 100%;
		background-color: #111111cc;
		backdrop-filter: blur(30px);
		display: flex;
		top: 0;
		left: 0;
		position: fixed;
		box-sizing: border-box;
		flex-direction: column;
		gap: 8px;
		padding-top: 8px;
		z-index: 99;
		justify-content: center;
		align-items: center;
	}

	.x-wrap {
		width: calc(100% - 80px);
		display: flex;
		justify-content: space-between;
	}

	.close {
		z-index: 100;
		display: flex;
		height: 48px;
		justify-content: end;
		background: none;
		text-align: end;
	}
	canvas {
		width: 324px;
		position: absolute;
		border-radius: 12px;
		background: linear-gradient(#00000000, rgba(0, 0, 0, 0.618));
	}

	.btn-wrap {
		display: flex;
		justify-content: center;
		gap: 8px;
	}

	.btn-wrap > button {
		border-radius: 999px;
		width: 48px;
		height: 48px;
		background-color: #222;
	}

	.toolbar {
		position: absolute;
		/* align-items: ; */
		justify-content: space-between;
		display: flex;
		flex-direction: column;

		gap: 12px;
		bottom: 40px;
		z-index: 101;
	}
</style>
