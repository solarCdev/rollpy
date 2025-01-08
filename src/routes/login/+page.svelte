<script lang="ts">
	import CustomInput from '$lib/components/customInput.svelte';
	import { auth } from '$lib/fbase';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import type { PageData } from './$types';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';
	import { FirebaseError } from 'firebase/app';

	let { data }: { data: PageData } = $props();

	let email = $state('');
	let password = $state('');

	let errorMsg = $state({
		email: '',
		password: ''
	});

	const onsubmit = async (
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) => {
		event.preventDefault();
		try {
			let res = await signInWithEmailAndPassword(auth, email, password);
			if (data.redirectTo) {
				window.location.href = data.redirectTo;
			} else {
				window.location.href = '/';
			}
		} catch (err) {
			let errObj = err as FirebaseError;
			console.log(errObj.code, errObj.name);
			if (errObj.code === 'auth/invalid-credential')
				errorMsg.password = '이메일 주소 또는 비밀번호가 잘못되었어요.';
			else if (errObj.code === 'auth/invalid-email')
				errorMsg.email = '형식이 맞지 않는 이메일 주소에요.';
			else if (errObj.code === 'auth/missing-password')
				errorMsg.password = '비밀번호를 입력해주세요.';
			else if (errObj.code === 'auth/user-not-found') errorMsg.password = '유저를 찾을 수 없어요.';
			else {
				errorMsg.password = '알 수 없는 오류가 발생했어요.';
			}
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
		type="email"
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
