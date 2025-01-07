<script lang="ts">
	import { currentNavBar, titleOnTop } from '$lib/currentNavBar';
	import { auth } from '$lib/fbase';
	import { updateProfile } from 'firebase/auth';
	import { onMount } from 'svelte';

	let emoji = $state('');
	let nickname = $state('');

	const onsubmit = async (
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) => {
		event.preventDefault();
		if (auth.currentUser)
			await updateProfile(auth.currentUser, { displayName: nickname, photoURL: emoji });
		window.location.href = '/';
	};

	onMount(() => {
		$titleOnTop = '프로필 바꾸기';
		$currentNavBar = 'out';
		if (!auth.currentUser) window.location.href = '/login&redirect=' + window.location.href;
		if (auth.currentUser && auth.currentUser.displayName !== null) {
			nickname = auth.currentUser.displayName;
		}
		if (auth.currentUser && auth.currentUser.photoURL !== null) {
			emoji = auth.currentUser.photoURL;
		}
	});
</script>

<form {onsubmit}>
	<div class="wrap">
		<input type="text" class="emoji" maxlength="3" bind:value={emoji} />
		<div class="nickname">
			<input
				type="text"
				class="big"
				maxlength="20"
				bind:value={nickname}
				placeholder="닉네임을 입력하세요"
			/>
			<span class="len">{nickname.length}/20</span>
		</div>
	</div>
	<input type="submit" value="완료" />
</form>

<style>
	form {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 600px;
	}

	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 32px;
		align-items: center;
	}

	.emoji {
		width: 128px;
		height: 128px;
		border-radius: 999px;
		font-size: 72px;
		text-align: center;
	}

	.len {
		color: #aaa;
		display: block;
		margin-right: 8px;
	}

	.nickname {
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: 4px;
	}

	.big {
		height: 72px;
		font-size: 24px;
		font-weight: 600;
		text-align: center;
	}

	input[type='submit'] {
		bottom: 24px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% - 40px);
	}
</style>
