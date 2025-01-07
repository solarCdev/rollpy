<script lang="ts">
	import { auth, db } from '$lib/fbase';
	import { collection, doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Tab from '$lib/components/tab.svelte';
	import Share from '$lib/components/share.svelte';
	import type { Paper } from '$lib/getPaperList';
	import Viewer from '$lib/components/viewer.svelte';
	import PaperButton from '$lib/components/paperButton.svelte';
	import ShareIcon from '$lib/assets/shareIcon.svelte';
	import WriteIcon from '$lib/assets/writeIcon.svelte';
	import MailIcon from '$lib/assets/mailIcon.svelte';
	import { currentNavBar, paperstatus, titleOnTop } from '$lib/currentNavBar';

	type Meta = {
		anonymous: boolean;
		createdAt: Date;
		title: string;
		creatorId: string;
		creator: string;
		mates: { emoji: string; name: string; uid: string; filled: Paper | null }[];
	};

	type ResponseData = {
		creatorId: string;
		anonymous: boolean;
		creator: string;
		title: string;
		createdAt: Timestamp;
		searchable: boolean;
		mates: { emoji: string; name: string; uid: string }[];
	};

	type Divider = 'writeLetter' | 'writtenLetter';

	let { data }: { data: PageData } = $props();
	let { id } = data;
	let meta: Meta | undefined = $state();
	let loading: boolean = $state(true);

	let written: Paper[] = $state([]);
	let toggleShare: boolean = $state(false);
	let toggleTab: Divider = $state('writeLetter');
	let viewIdx: number | null = $state(null);
	let viewType: 'wrote' | 'written' = $state('written');

	onMount(async () => {
		if (!auth.currentUser) {
			window.location.href = '/login?redirect=' + window.location.href;
		}
		const response = await getDoc(doc(db, 'team', id));
		const result = response.data() as ResponseData;
		meta = {
			anonymous: result.anonymous,
			title: result.title,
			creator: result.creator,
			createdAt: result.createdAt.toDate(),
			creatorId: result.creatorId,
			mates: []
		};
		$paperstatus = {
			id,
			anonymous: meta.anonymous,
			title: meta.title,
			type: 'team',
			creator: meta.creatorId
		};
		$titleOnTop = '';
		$currentNavBar = 'paper';
		result.mates.forEach((v) => {
			meta?.mates.push({ ...v, filled: null });
		});

		const paperUserWrote = query(
			collection(db, 'team', id, 'papers'),
			where('creatorId', '==', auth.currentUser?.uid)
		);

		const wroteResponse = await getDocs(paperUserWrote);
		const papersIWrote = wroteResponse.docs;
		papersIWrote.forEach((v) => {
			meta?.mates.forEach((mate, i) => {
				if (mate.uid === v.data().to) {
					if (meta) meta.mates[i].filled = v.data() as Paper;
				}
			});
		});

		const writtenByUser = query(
			collection(db, 'team', id, 'papers'),
			where('to', '==', auth.currentUser?.uid)
		);

		const writtenResponse = await getDocs(writtenByUser);
		writtenResponse.forEach((doc) => {
			written.push({ ...(doc.data() as Paper) });
		});

		loading = false;
	});
</script>

{#if !loading}
	{#if viewIdx !== null}
		{#key viewIdx}
			<Viewer
				single={viewType === 'wrote'}
				info={viewType === 'written'
					? written[viewIdx]
					: (meta?.mates[viewIdx].filled as unknown as Paper)}
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
				<Share link={window.location.href + '/invite'} />
			{/snippet}</Tab
		>
	{/if}
	<div class="info-wrap">
		<h1>{meta?.title}</h1>
		<span>{meta?.creator}</span>
		<div class="buttons">
			<button
				onclick={() => {
					window.location.href = '/team/' + id + '/invite';
				}}
			>
				+ 참여하기
			</button>
			<button
				class="secondary"
				onclick={() => {
					toggleShare = !toggleShare;
				}}
			>
				<ShareIcon />
				공유하기</button
			>
		</div>
	</div>
	<div>
		<div class="tab">
			<button
				class={toggleTab === 'writeLetter' ? 'tab-hl' : 'tab-nhl'}
				onclick={() => {
					toggleTab = 'writeLetter';
				}}><WriteIcon />편지 쓰기</button
			>
			<button
				class={toggleTab === 'writtenLetter' ? 'tab-hl' : 'tab-nhl'}
				onclick={() => {
					toggleTab = 'writtenLetter';
				}}><MailIcon />내게 온 편지</button
			>
		</div>
	</div>
	<div class="list-wrap">
		{#if toggleTab === 'writeLetter'}
			<ul>
				{#if meta}
					{#each meta.mates as mate, i}
						{#if mate.uid !== auth.currentUser?.uid}
							<button
								class="none"
								onclick={() => {
									if (!mate.filled) {
										window.location.href = '/write?type=team&id=' + id + '&to=' + mate.uid;
									} else {
										viewIdx = i;
										viewType = 'wrote';
									}
								}}
							>
								<PaperButton emoji={mate.emoji} name={mate.name} />
							</button>
						{/if}
					{/each}
				{/if}
			</ul>
		{:else}
			<ul>
				{#each written as paper, i}
					<button
						class="none"
						onclick={() => {
							viewIdx = i;
							viewType = 'written';
						}}><PaperButton emoji={paper?.creatorEmoji} name={paper.creator} /></button
					>
				{/each}
			</ul>
		{/if}
	</div>
	<div class="my">
		<a href="/newteam">나만의 그룹 만들러 가기</a>
	</div>
{/if}

<style>
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
		z-index: -1;
		justify-content: center;
	}

	.my > a {
		font-size: 16px;
		font-weight: 500;
	}
</style>
