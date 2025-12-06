<script lang="ts">
	import { onMount } from 'svelte';
	import { catalogingService } from '$lib';
	import type { Product } from '$lib';
	import Header from '$lib/components/Header.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	let allProducts = $state<Product[]>([]);
	let filteredProducts = $state<Product[]>([]);
	let searchQuery = $state('');
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		await fetchProducts();
	});

	async function fetchProducts() {
		loading = true;
		error = null;

		try {
			const response = await catalogingService.getProducts();
			allProducts = response.products;
			filteredProducts = response.products;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load products';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (searchQuery.trim() === '') {
			filteredProducts = allProducts;
		} else {
			const query = searchQuery.toLowerCase();
			filteredProducts = allProducts.filter((p) => p.name.toLowerCase().includes(query));
		}
	});

	function handleSearchChange(query: string) {
		searchQuery = query;
	}

	function handleRetry() {
		fetchProducts();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

	<main class="max-w-screen-2xl mx-auto">
		{#if error}
			<ErrorMessage message={error} onRetry={handleRetry} />
		{:else}
			<ProductGrid products={filteredProducts} {loading} {searchQuery} />
		{/if}
	</main>
</div>
