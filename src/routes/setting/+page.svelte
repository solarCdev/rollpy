<script>
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';
	import { auth } from '$lib/fbase';
	import { signOut } from 'firebase/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		$titleOnTop = '설정';
		$currentNavBar = 'out';
	});
</script>

<button
	onclick={async () => {
		await signOut(auth);
		window.location.href = '/';
	}}>로그아웃</button
>
<span>Rollpy v1.0</span>

<style>
	button {
		width: 100%;
	}
</style>
