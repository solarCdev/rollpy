<script lang="ts">
	import CustomInput from '$lib/components/customInput.svelte';
	import { auth } from '$lib/fbase';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import type { PageData } from './$types';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';

	let { data }: { data: PageData } = $props();

	let email = $state('');
	let password = $state('');

	let errorMsg = {
		email: '',
		password: ''
	};

	const onsubmit = async (
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) => {
		event.preventDefault();
		let res = await signInWithEmailAndPassword(auth, email, password);
		if (data.redirectTo) {
			window.location.href = data.redirectTo;
		} else {
			window.location.href = '/';
		}
	};

	onMount(() => {
		$titleOnTop = '로그인';
		$currentNavBar = 'out';
		if (auth.currentUser) {
			window.location.href = '/';
		}
	});
</script>

<form {onsubmit}>
	<CustomInput
		bind:value={email}
		label="이메일"
		type="text"
		placeholder="이메일 주소를 입력해주세요"
		errorMessage={errorMsg.email}
	/>
	<CustomInput
		bind:value={password}
		label="비밀번호"
		type="password"
		placeholder="비밀번호를 입력해주세요"
		errorMessage={errorMsg.password}
	/>
	<!-- <input type="text" placeholder="아이디를 입력해주세요" bind:value={email} /> -->
	<input type="submit" value="로그인" />
	<span class="new-acc"
		>아직 계정이 없으시다면? <a
			href={'/signup' + (data.redirectTo !== null ? '?redirect=' + data.redirectTo : '')}
			>회원가입</a
		></span
	>
</form>

<style>
	.new-acc {
		display: block;
		width: 100%;
		text-align: center;
	}
</style>
