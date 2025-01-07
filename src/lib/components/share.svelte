<script lang="ts">
	import Toast from './toast.svelte';

	let { link }: { link?: string } = $props();

	let showToast: boolean = $state(false);

	const onshareBtnClick = (event: Event & { currentTarget: HTMLButtonElement }) => {
		navigator.clipboard.writeText(link ? link : window.location.href);
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, 2000);
	};
</script>

{#if showToast}
	<Toast message="복사되었습니다." />
{/if}
<div class="wrap">
	<div class="title-wrap">
		<h1>공유하기</h1>
		<span>소중한 사람들과 롤링페이퍼를 공유해보세요</span>
	</div>

	<button onclick={onshareBtnClick}>링크 복사</button>
	<img
		src={'https://api.qrserver.com/v1/create-qr-code/?data=' +
			(link ? link : window.location.href) +
			'&size=300x300'}
		alt={link ? link : window.location.href}
	/>
	<span>링크 QR코드</span>
</div>

<style>
	.wrap {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.title-wrap {
		margin-bottom: 24px;
	}

	h1 {
		margin-bottom: 4px;
		text-align: center;
	}

	span {
		font-weight: 400;
		color: #aaa;
	}

	button {
		width: 100%;
		margin: 16px;
		margin-bottom: 48px;
	}

	img {
		width: 200px;
		margin-bottom: 4px;
	}
</style>
