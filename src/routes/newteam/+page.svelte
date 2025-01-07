<script lang="ts">
	import CustomInput from '$lib/components/customInput.svelte';
	import LoginPopup from '$lib/components/loginPopup.svelte';
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';
	import { auth, db } from '$lib/fbase';
	import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let anonymous: Boolean = $state(false);
	let title: string = $state('');

	const onsubmit = async (
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) => {
		event.preventDefault();
		const res = await addDoc(collection(db, 'team'), {
			createdAt: Timestamp.now(),
			creatorId: auth.currentUser?.uid,
			creator: auth.currentUser?.displayName,
			title,
			mates: [
				{
					uid: auth.currentUser?.uid,
					name: auth.currentUser?.displayName,
					emoji: auth.currentUser?.photoURL
				}
			],
			matesArr: [auth.currentUser?.uid]
		});
		window.location.href = '/team/' + res.id;
	};

	onMount(() => {
		$titleOnTop = '새 그룹';
		$currentNavBar = 'out';
		if (!auth.currentUser) {
			window.location.href = '/login?redirect=' + window.location.href;
		}
	});
</script>

<form {onsubmit}>
	<CustomInput
		type="text"
		placeholder="그룹명을 입력해주세요"
		label="그룹명"
		errorMessage=""
		required={true}
		bind:value={title}
	/><input type="submit" value="생성" />
</form>
