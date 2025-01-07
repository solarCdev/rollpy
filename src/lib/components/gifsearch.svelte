<script lang="ts">
	import { getGIF } from '$lib/getGIF';
	import { onDestroy } from 'svelte';

	let { closeTab, createNewGif } = $props();

	type GifList = [
		{
			created: number;
			hasaudio: boolean;
			id: string;
			tags: string[];
			title: string;
			content_description: string;
			itemurl: string;
			hascaption: boolean;
			flags: string;
			bg_color: string;
			url: string;
			media_formats: Media_formats;
		}?
	];

	type Media_formats = {
		gif: {
			url: string;
			dims: [number, number];
		};
		gifpreview: {
			url: string;
			dims: [number, number];
		};
		gif_transparent?: {
			url: string;
			dims: [number, number];
		};
		mp4: {
			url: string;
			dims: [number, number];
		};
		webm: {
			url: string;
			dims: [number, number];
		};
	};

	let gifList: GifList = $state([]);
	let type: string = $state('gif');
	let selected: number = $state(-1);

	let query = $state('');

	const onsubmit = async (event: Event) => {
		event.preventDefault();
		gifList = [];
		const list = await getGIF(query, type);
		gifList = list.results;
	};

	const onclick = (event: Event & { currentTarget: EventTarget & HTMLButtonElement }) => {
		selected = Number(event.currentTarget.id);
		closeTab();
	};

	onDestroy(() => {
		if (selected != -1) {
			createNewGif(
				gifList[selected]?.media_formats.mp4.url,
				gifList[selected]?.media_formats.mp4.dims[0],
				gifList[selected]?.media_formats.mp4.dims[1]
			);
			// if (gifList[selected]?.media_formats.gif_transparent) {
			// 	createNewGif(gifList[selected]?.media_formats.gif_transparent?.url);
			// } else {
			// 	createNewGif(gifList[selected]?.media_formats.gif.url);
			// }
		}
	});
</script>

<div class="flex">
	<form {onsubmit}>
		<input type="text" bind:value={query} placeholder="검색어를 입력해주세요" />
		<input type="submit" value="검색" />
		<div class="choice">
			<div>
				<label>
					<span>Gifs</span>
					<input type="radio" name="giftype" value="gif" bind:group={type} />
				</label>
			</div>
			<div>
				<label>
					<span>Stickers</span>

					<input type="radio" name="giftype" value="sticker" bind:group={type} />
				</label>
			</div>
		</div>
	</form>

	<div>
		<ul class="list-wrap">
			{#each gifList as gif, i}
				<button {onclick} id={String(i)} class="none">
					<img src={gif?.media_formats.gif.url} width="100px" alt="" loading="lazy" /></button
				>
			{/each}
		</ul>
	</div>
</div>

<style>
	form {
		width: 100%;
	}
	input[type='text'],
	input[type='submit'] {
		width: 100%;
		margin-bottom: 4px;
	}

	.none {
		/* background: none; */
		width: 100px;
		padding: 0;
		margin: 0;
	}
	.list-wrap {
		display: flex;
		width: 320px;
		height: 400px;
		overflow-y: scroll;
	}
	.flex {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	form {
		margin: 24px;
		margin-top: 0;
		gap: 4px;
	}

	.choice {
		margin-top: 12px;
	}

	.list-wrap::-webkit-scrollbar-track {
		display: none;
	}
</style>
