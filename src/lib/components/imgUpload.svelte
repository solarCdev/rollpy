<script lang="ts">
	import { auth, db } from '$lib/fbase';
	import { deleteImg, uploadImage } from '$lib/imageFunc';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import LoginPopup from './loginPopup.svelte';
	import { onAuthStateChanged } from 'firebase/auth';

	let { closeTab, createNewImg } = $props();
	let img: null | File = $state(null);
	let toggleError = $state(false);
	let curList: string[] = $state([]);
	let loggedIn = $state(false);

	const readImg = async (img: File) => {
		const url: string = await uploadImage(img, curList);
		createNewImg(url);
		closeTab();
	};

	const onchange = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (event.currentTarget?.files) {
			img = event.currentTarget.files[0];
			try {
				readImg(img);
			} catch (e) {
				toggleError = true;
				setTimeout(() => {
					toggleError = false;
				}, 3000);
			}
		}
	};

	const onclick = (img: string) => {
		createNewImg(img);
		closeTab();
	};

	onMount(() => {
		auth.onAuthStateChanged(async () => {
			try {
				if (auth.currentUser) {
					loggedIn = true;

					const snapshot = await getDoc(doc(db, 'user', auth.currentUser.uid));
					if (snapshot.data()?.uploadedImgs) curList = snapshot.data()?.uploadedImgs;

					toggleError;
				} else {
					loggedIn = false;
				}
			} catch (err) {
				toggleError = true;
			}
		});
	});
</script>

<div class="wrap">
	{#if loggedIn}
		{#if toggleError}
			<div>
				<span>이미지를 불러오는데에 실패했습니다.</span>
			</div>
		{/if}
		<label class="upload-zone" for="fileLoader"
			>사진 첨부 📷
			<span>이곳을 클릭해 이미지를 업로드하세요</span></label
		>

		<input
			style="display:none;"
			type="file"
			id="fileLoader"
			accept=".png, .jpg, .jpeg"
			{onchange}
		/>
		<ul class="list-wrap">
			{#each curList as cur, i}
				<button
					onclick={() => {
						onclick(cur);
					}}
					class="none"
				>
					<img src={cur} width="100px" loading="lazy" alt="로딩중..." /></button
				>
			{/each}
		</ul>
	{:else}
		<LoginPopup />
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.upload-zone {
		width: 100%;
		height: 160px;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		border-radius: 12px;
		border: 1px dashed white;
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 32px;
		gap: 4px;
	}

	.upload-zone > span {
		font-size: 14px;
		font-weight: 400;
		color: #aaa;
	}

	.list-wrap {
		display: flex;
		width: 320px;
		height: 400px;
		overflow-y: scroll;
		align-items: start;
		flex-wrap: wrap;
		gap: 10px;
	}

	.none {
		width: 92px;
		height: fit-content;
		background: none;
		border-radius: 0;
		padding: 0;
		margin: 0;
	}
</style>
