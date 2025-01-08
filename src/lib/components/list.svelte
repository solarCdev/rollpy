<script lang="ts">
	import { auth } from '$lib/fbase';

	let {
		cnt,
		title,
		date,
		mates
	}: {
		cnt?: number;
		title: string;
		date: Date;
		mates?: { name: string; uid: string; emoji: string }[];
	} = $props();
</script>

<li class="wrap">
	<div class="cnt">
		{#if cnt !== undefined}
			<span><strong>{cnt}</strong>명이 이 롤링페이퍼에 편지를 남겼어요!</span>
		{:else if mates}
			<span
				>{mates[0].name}
				<strong>({mates.length}명)</strong></span
			>
		{/if}
	</div>
	<div class="main">
		<h2>{title}</h2>
		<span
			>{date.getFullYear() +
				'.' +
				('0' + (date.getMonth() + 1)).slice(-2) +
				'.' +
				('0' + date.getDate()).slice(-2)}</span
		>
	</div>
</li>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 24px 8px 24px 8px;
		border-top: 1px solid #242424;
	}

	.main {
		margin-left: 8px;
		margin-right: 8px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 4px;
	}
	.main > span {
		color: #aaa;
	}

	strong {
		color: #f6004e;
		font-weight: 400;
	}

	.cnt {
		width: fit-content;
		padding: 4px 12px 4px 12px;
		border-radius: 999px;
		background-color: #222;
	}
</style>
