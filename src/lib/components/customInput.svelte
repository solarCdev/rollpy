<script lang="ts">
	function makeid(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}
	let {
		value = $bindable(),
		errorMessage,
		placeholder = '',
		label,
		type = 'text',
		className = 'well',
		required = false,
		maxlength = 1000
	} = $props();
	let id = makeid(5);
</script>

<div class="input-wrap">
	<label class={type === 'radio' || type === 'checkbox' ? 'big-label' : 'label'} for={id}
		>{label}</label
	>
	{#if type === 'checkbox'}
		<input {id} bind:checked={value} type="checkbox" class={className} />
	{:else if type === 'radio'}
		<input {id} bind:group={value} type="radio" class={className} />
	{:else if type === 'password'}
		<input {id} bind:value {placeholder} class={className} type="password" {required} />
	{:else if type === 'color'}
		<input {id} bind:value class={className} type="color" />
	{:else if type === 'email'}
		<input {id} bind:value {placeholder} class={className} type="email" {required} />
	{:else if type === 'emoji'}
		<input
			{id}
			maxlength="3"
			bind:value
			{placeholder}
			class={className + ' emoji'}
			type="text"
			{required}
		/>
	{:else}
		<input {id} {maxlength} bind:value {placeholder} class={className} type="text" {required} />
	{/if}
	{#if errorMessage}
		<div class="errMsg">
			<span>{errorMessage}</span>
		</div>
	{/if}
</div>

<style>
	.label {
		margin-left: 8px;
		margin-bottom: 4px;
		display: block;
		font-size: 12px;
		color: #aaa;
	}

	.big-label {
		font-size: 16px;
		font-weight: 500;
		margin-left: 8px;
		margin-right: 8px;
	}

	input {
		width: 100%;
		font-size: 14px;
		border: none;
		background-color: #222222;
		border-radius: 12px;
		height: 48px;
	}

	input:focus {
		background-color: #303030;
	}

	input::-webkit-input-placeholder {
		color: #aaa;
	}
	input::-moz-placeholder {
		color: #aaa;
	}

	span {
		display: block;
		font-size: 14px;
		margin-left: 8px;
		margin-top: 4px;
		color: #f6004e;
	}

	input[type='checkbox'] {
		width: 16px;
		height: 16px;
		border-radius: 4px;
	}

	.emoji {
		width: 48px;
		height: 48px;
		border-radius: 999px;
		text-align: center;
	}
</style>
