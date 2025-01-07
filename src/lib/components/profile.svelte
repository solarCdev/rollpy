<script>
	import { auth } from '$lib/fbase';
</script>

{#if auth.currentUser}
	<a href="/profile">
		<div>
			{auth.currentUser?.photoURL}
		</div></a
	>
{/if}

<style>
	div {
		width: 32px;
		height: 32px;
		font-size: 18px;
		border-radius: 999px;
		background-color: #222;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 18px;
	}
</style>
