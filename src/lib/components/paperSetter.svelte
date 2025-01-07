<script lang="ts">
	import { paperstatus } from '$lib/currentNavBar';
	import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
	import CustomInput from './customInput.svelte';
	import { db } from '$lib/fbase';

	let title: string = $state($paperstatus.title);
	let anonymous: boolean = $state($paperstatus.anonymous);
</script>

<h1>정보 수정</h1>
<form
	onsubmit={async (event) => {
		event.preventDefault();
		const res = await updateDoc(doc(db, $paperstatus.type, $paperstatus.id), { anonymous, title });
		window.location.reload();
	}}
>
	<CustomInput label="제목" errorMessage="" placeholder="제목을 입력해주세요" bind:value={title} />
	<CustomInput label="익명 페이퍼" errorMessage="" type="checkbox" bind:value={anonymous} />
	<input type="submit" value="수정" />
</form>

<button
	onclick={async () => {
		const response = confirm('정말 삭제할까요? 되돌릴 수 없습니다.');
		if (response) {
			await deleteDoc(doc(db, $paperstatus.type, $paperstatus.id));
			window.location.href = '/';
		}
	}}>이 롤링페이퍼 삭제</button
>

<style>
	h1 {
		margin-bottom: 24px;
	}
	button {
		margin-top: 320px;
		width: 100%;
		background-color: red;
	}
</style>
