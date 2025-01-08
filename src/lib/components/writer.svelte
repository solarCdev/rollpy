<script lang="ts">
	import Gifsearch from '$lib/components/gifsearch.svelte';
	import Tab from '$lib/components/tab.svelte';
	import { renderCanvas, uploadCanvas } from '$lib/canvasControl';
	import { Canvas, Rect } from 'fabric';
	import { GifGenerator, ImgGenerator, RectGenerator, TextGenerator } from '$lib/generators';
	import { onMount } from 'svelte';
	import Rectedit from '$lib/components/rectedit.svelte';
	import Textedit from '$lib/components/textedit.svelte';
	import ImgUpload from '$lib/components/imgUpload.svelte';
	import { downloadAllWebfont } from '$lib/webfontDownloader';
	import CustomInput from '$lib/components/customInput.svelte';
	import RectIcon from '$lib/assets/rectIcon.svelte';
	import TextIcon from '$lib/assets/textIcon.svelte';
	import ImageIcon from '$lib/assets/imageIcon.svelte';
	import GifIcon from '$lib/assets/gifIcon.svelte';
	import { doc, getDoc } from 'firebase/firestore';
	import { db } from '$lib/fbase';
	import { FirebaseError } from 'firebase/app';

	type TabType = 'gifSearch' | 'textEdit' | 'rectEdit' | 'imgUpload' | 'none';
	type Selected = 'rect' | 'text' | 'gif' | 'img' | 'none' | 'bg';

	let { id, team, to }: { id: string; team: boolean; to?: string } = $props();

	let canvas: Canvas | undefined = $state();
	let textGenerator: TextGenerator | undefined = $state();
	let gifGenerator: GifGenerator | undefined = $state();
	let rectGenerator: RectGenerator | undefined = $state();
	let imgGenerator: ImgGenerator | undefined = $state();
	let canvasEle: HTMLCanvasElement;

	let toggleTab = $state(false);
	let toggleSubmit = $state(false);
	let tab: TabType = $state('gifSearch');

	let selected: Selected = $state('bg');
	let nickname: string = $state('');
	let emoji: string = $state('');
	let bgColor: string = $state('white');

	let errMsg = $state('');

	$effect(() => {
		bgColor = bgColor;
		if (canvas) canvas.backgroundColor = bgColor;
		canvas?.renderAll();
	});

	const openTab = (type: TabType) => {
		tab = type;
		toggleTab = true;
	};

	const closeTab = () => {
		tab = 'none';
		toggleTab = false;
	};

	const onBtnClick = (event: Event & { currentTarget: EventTarget & HTMLButtonElement }) => {
		if (event.currentTarget.id === 'rect') rectGenerator?.createNew();
		else if (event.currentTarget.id === 'text') {
			textGenerator?.createNew('hello', { fontsize: 40, color: 'white' });
			openTab('textEdit');
		} else if (event.currentTarget.id === 'gif') {
			openTab('gifSearch');
		} else if (event.currentTarget.id === 'img') openTab('imgUpload');
	};

	const createNewGif = (url: string, width: number, height: number) => {
		gifGenerator?.createNew(url, width, height);
	};

	const createNewImg = (url: string) => {
		imgGenerator?.createNew(url, 100);
	};

	const selector = (type: Selected) => {
		selected = type;
	};

	const onsubmit = async (event: Event & { currentTarget: EventTarget & HTMLFormElement }) => {
		event.preventDefault();
		try {
			if (to) {
				let isDoc = (await getDoc(doc(db, 'team', id))).data() !== undefined;
				if (!isDoc) throw new FirebaseError('', '');
				await uploadCanvas(team, id, nickname, emoji, canvas, to);
				window.location.href = '/team/' + id;
			} else {
				let isDoc = (await getDoc(doc(db, 'paper', id))).data() !== undefined;
				if (!isDoc) throw new FirebaseError('', '');
				await uploadCanvas(team, id, nickname, emoji, canvas);
				window.location.href = '/paper/' + id;
			}
		} catch (err) {
			console.log(err);
			errMsg = '알 수 없는 에러가 발생했습니다.';
		}
	};

	onMount(() => {
		canvas = renderCanvas({
			canvasEle,
			selector: selector,
			backgroundColor: 'white',
			backgroundImg: undefined
		});
		downloadAllWebfont();
		textGenerator = new TextGenerator(canvas, selector);
		gifGenerator = new GifGenerator(canvas, selector);
		rectGenerator = new RectGenerator(canvas, selector);
		imgGenerator = new ImgGenerator(canvas, selector);

		canvas.add(new Rect({ width: 0, height: 0, selectable: true }));
	});
</script>

{#if toggleTab}
	<Tab {closeTab}>
		{#snippet child()}
			{#if tab === 'gifSearch'}
				<Gifsearch {closeTab} {createNewGif} />
			{:else if tab === 'textEdit'}
				<Textedit {canvas} modifier={textGenerator?.modify} />
			{:else if tab === 'imgUpload'}
				<ImgUpload {closeTab} {createNewImg} />
			{/if}
		{/snippet}
	</Tab>
{/if}
{#if toggleSubmit}
	<Tab
		closeTab={() => {
			toggleSubmit = false;
		}}
	>
		{#snippet child()}
			<form {onsubmit}>
				{#if !team}
					<CustomInput
						errorMessage={errMsg}
						label="사용할 이름"
						type="text"
						maxlength={8}
						placeholder="닉네임을 입력하세요"
						required={true}
						bind:value={nickname}
					/>
					<CustomInput
						errorMessage=""
						label="프로필 이모지"
						type="emoji"
						placeholder="?"
						required={true}
						bind:value={emoji}
					/>
				{/if}
				<input type="submit" value="보내기" />
			</form>
		{/snippet}
	</Tab>
{/if}
<div class="flex">
	<div class="edits">
		{#if selected === 'text'}
			<button
				onclick={() => {
					openTab('textEdit');
				}}>편집</button
			>

			<button
				onclick={() => {
					rectGenerator?.removeSelected();
				}}>삭제</button
			>
		{:else if selected === 'rect'}
			<Rectedit {canvas} modifier={rectGenerator?.modify} />

			<button
				onclick={() => {
					rectGenerator?.removeSelected();
				}}>삭제</button
			>
		{:else if selected === 'img'}
			<button
				onclick={() => {
					imgGenerator?.removeSelected();
				}}>삭제</button
			>
		{:else if selected === 'gif'}
			<button
				onclick={() => {
					gifGenerator?.removeSelected();
				}}>삭제</button
			>
		{:else}
			<label>
				<span>Bg color</span>
				<input type="color" bind:value={bgColor} />
			</label>
		{/if}
	</div>
	<canvas bind:this={canvasEle} width="324px" height="576px"></canvas>
	<div>
		<div class="items">
			<button id="rect" onclick={onBtnClick}><RectIcon /></button>
			<button id="text" onclick={onBtnClick}><TextIcon /></button>
			<button id="gif" onclick={onBtnClick}><GifIcon /></button>
			<button id="img" onclick={onBtnClick}><ImageIcon /></button>
		</div>
	</div>
	<button
		class="end"
		onclick={() => {
			toggleSubmit = true;
		}}
	>
		완료
	</button>
</div>

<style>
	.flex {
		flex-direction: column;
		align-items: center;
	}

	.edits {
		display: flex;
		align-items: center;
		gap: 12px;
		z-index: 101;
		margin-bottom: 16px;
	}

	.edits > button {
		height: 48px;
		background-color: #111;
		border: #242424 solid 1px;
		border-radius: 999px;
	}

	canvas {
		position: absolute;
		border-radius: 12px;
		z-index: 100;
	}

	.items {
		margin-top: -64px;
		left: 50%;
		transform: translateX(calc(-162px + 16px));
		display: flex;
		gap: 12px;
		z-index: 102;
		position: absolute;
	}

	label {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		justify-content: center;
	}

	span {
		font-size: 16px;
		font-weight: 500;
	}

	.items > button {
		height: 48px;
		width: 48px;
		background-color: #111;
		border: #242424 solid 1px;
		border-radius: 999px;
	}

	.end {
		margin-top: 16px;
		margin-bottom: 48px;
		width: 324px;
	}
</style>
