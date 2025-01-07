<script>
	import { auth } from '$lib/fbase';
	import png from '$lib/assets/main.png';
	import { onMount } from 'svelte';
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';

	onMount(() => {
		$titleOnTop = '';
		$currentNavBar = 'basis';
	});
</script>

<div class="wrap">
	<h1>
		{#if auth.currentUser}
			{auth.currentUser?.displayName} 님, 반가워요!
		{:else}
			추억 저장소, 롤피입니다!
		{/if}
		<br />
		멋진 롤링페이퍼를 만들어보아요!
	</h1>
	{#if auth.currentUser}
		<a href="/newpaper"><button>새 롤링페이퍼</button></a>
		<a href="/newteam"><button class="light">새 그룹 롤링페이퍼</button></a>
	{:else}
		<a href="/login"><button>로그인</button></a>
	{/if}

	<img src={png} alt="main" />
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	a {
		width: 100%;
	}

	button {
		width: 100%;
		margin-bottom: 8px;
	}

	img {
		max-height: 5400px;
		width: 360px;
	}

	h1 {
		margin-bottom: 40px;
	}
	.light {
		color: #ff0051;
		background-color: #330010;
	}
</style>
