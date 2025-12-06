<script lang="ts">
	interface EmptyStateProps {
		searchQuery?: string;
	}

	let { searchQuery }: EmptyStateProps = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 text-gray-500 text-center">
	<div class="text-6xl mb-4">🔍</div>
	<h3 class="text-xl font-medium text-gray-700 mb-2">No products found</h3>
	{#if searchQuery}
		<p class="text-gray-500 mb-1">No results for "{searchQuery}"</p>
	{/if}
	<p class="text-gray-400 text-sm">Try different keywords</p>
</div>
