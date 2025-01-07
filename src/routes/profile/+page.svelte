<script lang="ts">
	import MailIcon from '$lib/assets/mailIcon.svelte';
	import WriteIcon from '$lib/assets/writeIcon.svelte';
	import List from '$lib/components/list.svelte';
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';
	import { auth, db } from '$lib/fbase';
	import { getPaperList, getTeamList } from '$lib/getPapersList';
	import { collection, getCountFromServer, getDoc, query, Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let tab: 'paper' | 'team' = $state('paper');
	// new Date().

	let paperList: { id: string; title: string; date: Date; creator: string; cnt: number }[] = $state(
		[]
	);
	let teamList: {
		id: string;
		title: string;
		date: Date;
		creator: string;
		mates: { emoji: string; name: string; uid: string }[];
	}[] = $state([]);

	onMount(async () => {
		$titleOnTop = '마이페이지';
		$currentNavBar = 'mypage';
		if (!auth.currentUser) {
			window.location.href = '/login&redirect=' + window.location.href;
		}
		(await getPaperList()).forEach(async (doc) => {
			if (!auth.currentUser) return;
			const cnt = (
				await getCountFromServer(query(collection(db, 'paper', doc.id, 'papers')))
			).data().count;

			paperList.push({
				id: doc.id,
				title: doc.data().title,
				date: (doc.data().createdAt as Timestamp).toDate(),
				creator: auth.currentUser.uid,
				cnt
			});
		});
		(await getTeamList()).forEach(async (doc) => {
			if (!auth.currentUser) return;

			teamList.push({
				id: doc.id,
				title: doc.data().title,
				date: (doc.data().createdAt as Timestamp).toDate(),
				creator: auth.currentUser.uid,
				mates: doc.data().mates as { emoji: string; name: string; uid: string }[]
			});
		});
	});
</script>

<div class="profile-wrap">
	<div class="profile">
		<div class="emoji">{auth.currentUser?.photoURL}</div>
		<h2>{auth.currentUser?.displayName}</h2>
	</div>
	<a href="/profile/edit">
		<button class="secondary">프로필 바꾸기</button>
	</a>
</div>

<div>
	<div class="tab">
		<button
			onclick={() => {
				tab = 'paper';
			}}
			class={tab === 'paper' ? 'tab-hl' : 'tab-nhl'}><WriteIcon /> 내 롤링페이퍼</button
		>
		<button
			onclick={() => {
				tab = 'team';
			}}
			class={tab === 'team' ? 'tab-hl' : 'tab-nhl'}><MailIcon /> 내 그룹</button
		>
	</div>

	<ol>
		{#if tab === 'paper'}
			{#each paperList as paper}
				<a href={'/paper/' + paper.id}
					><List title={paper.title} date={paper.date} cnt={paper.cnt} /></a
				>
			{/each}
		{:else}
			{#each teamList as team}
				<a href={'/team/' + team.id}
					><List title={team.title} date={team.date} mates={team.mates} /></a
				>
			{/each}
		{/if}
	</ol>
</div>

<style>
	.profile {
		display: flex;
		align-items: center;
		gap: 12px;
		height: fit-content;
	}

	.emoji {
		width: 64px;
		height: 64px;
		background-color: #222;
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
	}

	.profile-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: fit-content;
		margin-bottom: 48px;
	}

	.secondary {
		height: 48px;
	}
</style>
