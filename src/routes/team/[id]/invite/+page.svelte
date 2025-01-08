<script lang="ts">
	import LoginPopup from '$lib/components/loginPopup.svelte';
	import Tab from '$lib/components/tab.svelte';
	import { auth, db } from '$lib/fbase';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';

	let { data }: { data: PageData } = $props();
	let { id } = data;
	let loggedIn: boolean = $state(true);

	onMount(async () => {
		try {
			if (!auth.currentUser) {
				loggedIn = false;
			}
			await auth.authStateReady();
			console.log(auth.currentUser);
			if (auth.currentUser === null) {
				window.location.href = '/login?redirect=' + window.location.href;
			}

			const ref = doc(db, 'team', id);
			const res = await getDoc(ref);
			console.log(res.data());
			const mates = res.data()?.mates as { emoji: string; name: string; uid: string }[];
			let include: boolean = false;
			if (mates.length > 40) {
				alert('참가 최대 인원은 40명입니다.');
				window.close();
			}
			mates.forEach((v) => {
				if (v.uid === auth.currentUser?.uid) include = true;
			});
			if (!include) {
				if (auth.currentUser?.displayName)
					mates.push({
						uid: auth.currentUser?.uid,
						name: auth.currentUser?.displayName,
						emoji: auth.currentUser?.photoURL ? auth.currentUser?.photoURL : '👤'
					});
				let matesArr = res.data()?.matesArr as string[];
				if (auth.currentUser) matesArr.push(auth.currentUser?.uid);
				await updateDoc(ref, { mates, matesArr });
			}
			if (auth.currentUser !== null) window.location.href = '/team/' + id;
		} catch (err) {
			window.location.href = '/';
		}
	});
</script>

{#if !loggedIn}
	<Tab
		closeTab={() => {
			window.close();
		}}
	>
		{#snippet child()}
			<LoginPopup />
		{/snippet}</Tab
	>
{/if}
