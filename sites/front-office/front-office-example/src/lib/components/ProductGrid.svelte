<script lang="ts">
	import type { Product } from '$lib/types/cataloging';
	import ProductCard from './ProductCard.svelte';
	import ProductCardSkeleton from './ProductCardSkeleton.svelte';
	import EmptyState from './EmptyState.svelte';

	interface ProductGridProps {
		products: Product[];
		loading: boolean;
		searchQuery?: string;
	}

	let { products, loading, searchQuery }: ProductGridProps = $props();
</script>

{#if loading}
	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 md:p-6 lg:p-8"
	>
		{#each Array(10) as _, i}
			<ProductCardSkeleton />
		{/each}
	</div>
{:else if products.length > 0}
	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 md:p-6 lg:p-8"
	>
		{#each products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>
{:else}
	<EmptyState {searchQuery} />
{/if}
