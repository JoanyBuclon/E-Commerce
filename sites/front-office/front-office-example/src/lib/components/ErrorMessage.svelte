<script lang="ts">
	interface ErrorMessageProps {
		message: string;
		onRetry?: () => void;
	}

	let { message, onRetry }: ErrorMessageProps = $props();
</script>

<div class="bg-red-50 border border-red-300 rounded-lg p-6 text-center mx-4 my-8">
	<div class="text-4xl mb-3">⚠️</div>
	<h3 class="text-lg font-semibold text-red-800 mb-2">Error loading products</h3>
	<p class="text-red-700 mb-4">{message}</p>
	{#if onRetry}
		<button
			onclick={onRetry}
			class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition-colors duration-200"
		>
			Try Again
		</button>
	{/if}
</div>
