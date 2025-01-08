<script lang="ts">
	import CenterAlignIcon from '$lib/assets/centerAlignIcon.svelte';
	import ColorPickIcon from '$lib/assets/colorPickIcon.svelte';
	import FontIcon from '$lib/assets/fontIcon.svelte';
	import LeftAlignIcon from '$lib/assets/leftAlignIcon.svelte';
	import RightAlignIcon from '$lib/assets/rightAlignIcon.svelte';
	import { type ModifierParams } from '$lib/generators';
	import { getWebfontList } from '$lib/webfontDownloader';
	import { text } from '@sveltejs/kit';

	class AlignText {
		align: [string, string, string];
		nextIdx: [number, number, number];
		now: number;

		constructor() {
			this.align = ['left', 'center', 'right'];
			this.nextIdx = [1, 2, 0];
			this.now = 0;
		}
		next() {
			this.now = this.nextIdx[this.now];
		}
		get(type: string) {
			this.now = this.align.indexOf(type);
		}
		set(setter: (aligns: string) => void) {
			setter(this.align[this.now]);
		}
	}

	let { canvas, modifier } = $props();

	const colors = [
		'#000000',
		'#333333',
		'#767676',
		'#CCCCCC',
		'#FFFFFF',
		'#F6004E',
		'#F69800',
		'#F6E600',
		'#C5F600',
		'#00B4F6',
		'#EE47D8'
	];

	let tab: 'font' | 'color' = $state('color');

	let color: string = $state(canvas?.getActiveObject()?.get('fill'));
	let fontsize: number = $state(canvas?.getActiveObject()?.get('fontSize'));
	let content: string = $state(canvas?.getActiveObject()?.get('text'));
	let nowFont: string = $state(canvas?.getActiveObject()?.get('font'));
	let textAlign = $state(canvas?.getActiveObject()?.get('textAlign'));
	const setter = (aligns: string) => {
		textAlign = aligns;
	};
	let alignText = new AlignText();
	// svelte-ignore state_referenced_locally
	alignText.get(textAlign);

	const fonts = getWebfontList();

	$effect(() => {
		if (fontsize > 150) fontsize = 150;
		let params: ModifierParams = {
			color: color,
			fontsize: fontsize,
			content: content,
			font: nowFont,
			textAlign: textAlign
		};
		modifier(params);
	});
	canvas?.getActiveObject()?.get('scaleX');
</script>

<div class="wrap">
	<textarea
		bind:value={content}
		style={'font-family:' +
			nowFont +
			';' +
			'font-size:' +
			fontsize +
			'px;' +
			'color:' +
			color +
			';' +
			'text-align:' +
			textAlign +
			';'}
	></textarea>
	<div>
		<input type="range" min="10" max="150" bind:value={fontsize} />
		<div class="toolbar">
			<button
				onclick={() => {
					tab = 'color';
				}}><ColorPickIcon /></button
			>
			<button
				onclick={() => {
					tab = 'font';
				}}><FontIcon /></button
			>
			<button
				onclick={() => {
					alignText.next();
					alignText.set(setter);
				}}
			>
				{#if textAlign === 'left'}
					<LeftAlignIcon />
				{:else if textAlign === 'center'}
					<CenterAlignIcon />
				{:else}
					<RightAlignIcon />
				{/if}
			</button>
		</div>
		<div class="ctrl">
			{#if tab === 'color'}
				<div class="palette">
					<input type="color" bind:value={color} />
					{#each colors as c}
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button
							onload={() => {
								console.log('background-color:' + c + ';');
							}}
							style={'background-color:' + c + ';'}
							onclick={() => {
								color = c;
							}}
						></button>
					{/each}
				</div>
			{:else}
				<select bind:value={nowFont} size="5">
					{#each fonts as font, i}
						<option
							style={'font-family:' + font[0] + ';'}
							value={font[1]}
							selected={i == 0 ? true : false}>{font[2]}</option
						>
					{/each}
				</select>
			{/if}
		</div>
	</div>
</div>

<style>
	.wrap {
		height: 560px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	input[type='range'] {
		width: 100%;
		margin-bottom: 24px;
	}

	textarea {
		ime-mode: auto;
		background: none;
		border: none;
		resize: none;
		transform: 0.2s ease;
		overflow-y: auto;
		width: 100%;
		line-height: 140%;
		display: flex;
	}

	.ctrl {
		height: 240px;
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.toolbar {
		display: flex;
	}

	.toolbar > button {
		background: none;
		width: 100%;
	}

	.palette {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.palette > button {
		width: 48px;
		height: 48px;
		border: 1px solid #242424;
		border-radius: 999px;
	}

	select {
		width: 100%;
		height: 100%;
		background: none;
		border: none;
	}

	option {
		font-size: 18px;
		height: 48px;
		text-align: center;
		display: flex;
		align-items: center;
	}

	option:checked {
		background: none;
		font-weight: 600;
		color: #f6004e;
	}
</style>
