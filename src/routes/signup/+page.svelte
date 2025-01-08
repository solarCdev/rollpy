<script lang="ts">
	import CustomInput from '$lib/components/customInput.svelte';
	import { auth, db } from '$lib/fbase';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		updateProfile,
		type UserCredential
	} from 'firebase/auth';
	import { addDoc, doc, setDoc } from 'firebase/firestore';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';
	import type { FirebaseError } from 'firebase/app';

	let { data }: { data: PageData } = $props();

	let email = $state('');
	let password = $state('');
	let passwordCheck = $state('');
	let nickname = $state('');

	let errorMsg = $state({
		email: '',
		password: '',
		passwordCheck: '',
		nickname: ''
	});

	const onsubmit = async (
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) => {
		event.preventDefault();

		errorMsg.email = '';
		errorMsg.nickname = '';
		errorMsg.password = '';
		errorMsg.passwordCheck = '';

		let pass = true;
		if (password !== passwordCheck) {
			errorMsg.passwordCheck = '비밀번호가 일치하지 않아요요.';
			pass = false;
		} else if (password.length < 6) {
			errorMsg.password = '비밀번호가 너무 짧아요요.';
			pass = false;
		}
		if (nickname.length !== nickname.replaceAll(' ', '').length) {
			errorMsg.nickname = '닉네임에 띄어쓰기를 포함할 수 없어요.';
			pass = false;
		}
		let res: UserCredential;
		if (pass) {
			try {
				res = await createUserWithEmailAndPassword(auth, email, password);
				await updateProfile(res.user, { displayName: nickname, photoURL: '👤' });
				await setDoc(doc(db, 'user', res.user.uid), {
					emoji: '👤',
					userName: nickname,
					uploadedImgs: []
				});
				if (data.redirectTo) {
					window.location.href = data.redirectTo;
				} else {
					window.location.href = '/';
				}
			} catch (err) {
				let errObj = err as FirebaseError;
				console.log(errObj);
				if (errObj.code === 'auth/email-already-in-use')
					errorMsg.email = '이미 사용중인 이메일입니다.';
				else if (errObj.code === 'auth/too-many-requests')
					errorMsg.email = '잠시 후에 다시 시도해 주세요.';
				else errorMsg.email = '알 수 없는 오류가 발생했어요.';
			}
		}
	};

	onMount(() => {
		$titleOnTop = '회원가입';
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
		required={true}
		errorMessage={errorMsg.email}
	/>
	<CustomInput
		bind:value={password}
		label="비밀번호"
		type="password"
		required={true}
		placeholder="비밀번호를 입력해주세요"
		errorMessage={errorMsg.password}
	/>
	<CustomInput
		bind:value={passwordCheck}
		label="비밀번호 확인"
		type="password"
		required={true}
		placeholder="비밀번호를 재입력해주세요"
		errorMessage={errorMsg.passwordCheck}
	/>
	<CustomInput
		bind:value={nickname}
		label="닉네임"
		type="text"
		placeholder="닉네임을 입력해주세요"
		errorMessage={errorMsg.nickname}
	/>
	<!-- <input type="text" placeholder="아이디를 입력해주세요" bind:value={email} /> -->
	<input type="submit" value="회원가입" />
	<span class="new-acc"
		>이미 계정이 있으시다면? <a
			href={'login/' + (data.redirectTo !== null ? '?redirect=' + data.redirectTo : '')}>로그인</a
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
