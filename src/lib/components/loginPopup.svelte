<script lang="ts">
	import CustomInput from '$lib/components/customInput.svelte';
	import { auth } from '$lib/fbase';
	import { signInWithEmailAndPassword } from 'firebase/auth';

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
		console.log(res);
		console.log(auth.currentUser);
	};
</script>

<form {onsubmit}>
	<CustomInput
		bind:value={email}
		label="아이디"
		type="text"
		placeholder="아이디를 입력해주세요"
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
	<span>아직 계정이 없으시다면?<a href="/signup">회원가입</a></span>
</form>
