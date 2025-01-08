<script lang="ts">
	import { db } from '$lib/fbase';
	import { collection, doc, getCountFromServer, getDoc, Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Tab from '$lib/components/tab.svelte';
	import Share from '$lib/components/share.svelte';
	import { PaperGetter, type Paper } from '$lib/getPaperList';
	import Viewer from '$lib/components/viewer.svelte';
	import PaperButton from '$lib/components/paperButton.svelte';
	import ShareIcon from '$lib/assets/shareIcon.svelte';
	import WriteIcon from '$lib/assets/writeIcon.svelte';
	import { currentNavBar, paperstatus, titleOnTop } from '$lib/currentNavBar';

	type Meta = {
		anonymous: boolean;
		createdAt: Date;
		title: string;
		creatorId: string;
		creator: string;
	};

	type ResponseData = {
		creatorId: string;
		anonymous: boolean;
		creator: string;
		title: string;
		createdAt: Timestamp;
		searchable: boolean;
	};

	let { data }: { data: PageData } = $props();
	let { id } = data;
	let meta: Meta | undefined = $state();
	let loading: boolean = $state(true);

	let paperGetter: PaperGetter = $state(new PaperGetter(id));
	let paperList: Paper[] = $state([]);
	let end = $state(false);
	let empty = $state(false);

	let toggleShare: boolean = $state(false);
	let cnt: number = $state(0);

	let viewIdx: number | null = $state(null);
	let err = $state(false);

	const onLoadMore = async () => {
		paperList = await paperGetter.next();
		end = paperGetter.end;
	};

	onMount(async () => {
		try {
			const response = await getDoc(doc(db, 'paper', id));
			const result = response.data() as ResponseData;
			meta = {
				anonymous: result.anonymous,
				title: result.title,
				creator: result.creator,
				createdAt: result.createdAt.toDate(),
				creatorId: result.creatorId
			};
			$paperstatus = {
				id,
				anonymous: meta.anonymous,
				title: meta.title,
				type: 'paper',
				creator: meta.creatorId
			};
			$titleOnTop = '';
			$currentNavBar = 'paper';
			cnt = (await getCountFromServer(collection(db, 'paper', id, 'papers'))).data().count;
			paperList = await paperGetter.getFirst();

			loading = false;
		} catch (a) {
			err = true;
		}
	});
</script>

{#if !err}
	{#if !loading}
		{#if viewIdx !== null}
			{#key viewIdx}
				<Viewer
					single={false}
					info={paperList[viewIdx]}
					prev={() => {
						if (viewIdx !== null) viewIdx--;
						return viewIdx;
					}}
					next={() => {
						if (viewIdx !== null) viewIdx++;
						return viewIdx;
					}}
					closeTab={() => {
						viewIdx = null;
					}}
				/>
			{/key}
		{/if}
		{#if toggleShare}
			<Tab
				closeTab={() => {
					toggleShare = false;
				}}
			>
				{#snippet child()}
					<Share />
				{/snippet}</Tab
			>
		{/if}
		<div class="info-wrap">
			<h1>{meta?.title}</h1>
			<span>By. {meta?.creator}</span>
			<div class="buttons">
				<a href={'/write?id=' + id}>
					<button><WriteIcon />편지 쓰기</button>
				</a>
				<button
					class="secondary"
					onclick={() => {
						toggleShare = !toggleShare;
					}}><ShareIcon />공유하기</button
				>
			</div>
		</div>
		<div class="summary">
			<span class="sub-title">도착한 편지</span>
			<h4>총 {cnt}개</h4>
		</div>
		<div class="list-wrap">
			{#if !paperGetter.empty}
				<ul>
					{#each paperList as paper, i}
						<button
							class="none"
							onclick={() => {
								viewIdx = i;
							}}
							><PaperButton
								emoji={!meta?.anonymous ? paper.creatorEmoji : '👤'}
								name={!meta?.anonymous ? paper.creator : '익명'}
							/></button
						>
					{/each}
				</ul>
			{:else}
				<span>아직 롤링페이퍼가 작성되지 않았어요!</span>
			{/if}
			{#if !end}
				<button
					class="more"
					onclick={() => {
						onLoadMore();
					}}>+ 더보기</button
				>
			{/if}
		</div>
		<div class="my">
			<a href="/newpaper">나만의 롤링페이퍼 만들러 가기</a>
		</div>
	{/if}
{:else}
	<span>에러가 발생했습니다. <a href="/">메인 화면으로 돌아가기</a> </span>
{/if}

<style>
	.summary {
		border-bottom: 1px solid #242424;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding-bottom: 8px;
		margin-bottom: 8px;
	}

	.none {
		background: none;
		width: 32%;
	}

	h1 {
		text-align: center;
		margin-bottom: 8px;
	}

	.info-wrap {
		margin: 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.info-wrap > span {
		color: #aaa;
	}

	.list-wrap {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: 64px;
	}

	.buttons {
		display: flex;
		gap: 12px;
		margin-top: 48px;
		margin-bottom: 48px;
	}

	.more {
		background: none;
	}

	.my {
		bottom: 0;
		left: 0;
		padding: 20px;
		width: 100%;
		display: flex;
		position: fixed;
		background-color: #111;
		border-top: solid #242424 1px;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.my > a {
		font-size: 16px;
		font-weight: 500;
	}
</style>
