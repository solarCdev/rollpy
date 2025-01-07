<script lang="ts">
	let { name, emoji } = $props();
</script>

<li>
	<div class="emoji">{emoji}</div>
	<span class="name">{name}</span>
</li>

<style>
	li {
		background: none;
		width: 100%;
		height: 112px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.emoji {
		width: 48px;
		height: 48px;
		background-color: #222;
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		margin-bottom: 8px;
	}

	.name {
		font-size: 16px;
		font-weight: 500;
	}
</style>
