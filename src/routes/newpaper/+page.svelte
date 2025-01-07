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
		let creator: string = '';
		if (auth.currentUser) {
			const response = await getDoc(doc(db, 'user', auth.currentUser?.uid));
			creator = response.data()?.userName;
		}
		const res = await addDoc(collection(db, 'paper'), {
			anonymous,
			createdAt: Timestamp.now(),
			creatorId: auth.currentUser?.uid,
			creator,
			title
		});
		window.location.href = '/paper/' + res.id;
	};

	onMount(() => {
		$titleOnTop = '새 롤링페이퍼';
		$currentNavBar = 'out';
	});
</script>

{#if auth.currentUser}
	<form {onsubmit}>
		<CustomInput
			type="text"
			placeholder="제목을 입력해주세요"
			label="제목"
			errorMessage=""
			required={true}
			bind:value={title}
		/>

		<CustomInput type="checkbox" label="익명 페이퍼" errorMessage="" bind:value={anonymous} />
		<input type="submit" value="생성" />
	</form>
{:else}
	<LoginPopup />
{/if}
