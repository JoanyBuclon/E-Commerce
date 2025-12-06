<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { catalogingService, isCatalogingError, cartStore, type Product } from '$lib';
	import ProductImage from '$lib/components/ProductImage.svelte';
	import Header from '$lib/components/Header.svelte';

	let product = $state<Product | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let addingToCart = $state(false);

	// Get product ID from URL
	const productId = $derived($page.params.id);

	// Derive if product is in cart and its quantity
	const inCartQuantity = $derived(product ? cartStore.getItemQuantity(product.id) : 0);

	async function fetchProduct() {
		if (!productId) return;

		loading = true;
		error = null;

		try {
			const response = await catalogingService.getProductById(productId);
			product = response.product;
		} catch (err) {
			if (isCatalogingError(err)) {
				error = err.message;
			} else {
				error = 'Failed to load product details';
			}
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchProduct();
	});

	function handleBack() {
		goto('/');
	}

	function handleAddToCart() {
		if (!product) return;

		addingToCart = true;

		try {
			cartStore.addItem(product, 1);

			// Show success feedback with brief delay
			setTimeout(() => {
				addingToCart = false;
			}, 300);
		} catch (err) {
			console.error('Failed to add to cart:', err);
			addingToCart = false;
		}
	}
</script>

<svelte:head>
	<title>{product?.name || 'Product'} - E-Commerce</title>
</svelte:head>

<Header searchQuery="" onSearchChange={() => {}} />

<div class="min-h-screen bg-gray-50">
	<!-- Back Button -->
	<div class="bg-white border-b">
		<div class="max-w-screen-2xl mx-auto px-4 py-4">
			<button
				onclick={handleBack}
				class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
			>
				<span class="text-xl">←</span>
				<span>Back to products</span>
			</button>
		</div>
	</div>

	<!-- Loading State -->
	{#if loading}
		<div class="max-w-screen-2xl mx-auto px-4 py-12">
			<div class="animate-pulse">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div class="bg-gray-200 rounded-lg aspect-square"></div>
					<div class="space-y-4">
						<div class="h-8 bg-gray-200 rounded w-3/4"></div>
						<div class="h-6 bg-gray-200 rounded w-1/4"></div>
						<div class="h-24 bg-gray-200 rounded"></div>
						<div class="h-12 bg-gray-200 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Error State -->
	{#if error && !loading}
		<div class="max-w-screen-2xl mx-auto px-4 py-12">
			<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
				<p class="text-red-800 text-lg mb-4">{error}</p>
				<button
					onclick={handleBack}
					class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
				>
					Go back to products
				</button>
			</div>
		</div>
	{/if}

	<!-- Product Details -->
	{#if product && !loading}
		<div class="max-w-screen-2xl mx-auto px-4 py-8">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg overflow-hidden">
				<!-- Product Image -->
				<div class="p-8">
					<div class="sticky top-24">
						<ProductImage {product} alt={product.name} />
					</div>
				</div>

				<!-- Product Info -->
				<div class="p-8 lg:border-l">
					<div class="space-y-6">
						<!-- Title -->
						<h1 class="text-3xl font-bold text-gray-900">
							{product.name}
						</h1>

						<!-- Price -->
						<div class="flex items-baseline gap-2">
							<span class="text-4xl font-bold text-orange-600">
								${product.price.toFixed(2)}
							</span>
						</div>

						<!-- Description -->
						<div class="border-t pt-6">
							<h2 class="text-lg font-semibold text-gray-900 mb-3">Description</h2>
							<p class="text-gray-700 leading-relaxed">
								{product.description}
							</p>
						</div>

						<!-- Product Meta -->
						{#if product.createdAt || product.updatedAt}
							<div class="border-t pt-6 text-sm text-gray-500 space-y-1">
								{#if product.createdAt}
									<p>
										<span class="font-medium">Added:</span>
										{new Date(product.createdAt).toLocaleDateString()}
									</p>
								{/if}
								{#if product.updatedAt}
									<p>
										<span class="font-medium">Updated:</span>
										{new Date(product.updatedAt).toLocaleDateString()}
									</p>
								{/if}
							</div>
						{/if}

						<!-- Actions -->
						<div class="border-t pt-6 space-y-3">
							{#if inCartQuantity > 0}
								<div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
									<p class="text-green-800 text-sm">
										<span class="font-semibold">{inCartQuantity}</span>
										{inCartQuantity === 1 ? 'item' : 'items'} in cart
									</p>
								</div>
							{/if}

							<button
								onclick={handleAddToCart}
								disabled={addingToCart}
								class="w-full py-3 px-6 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{addingToCart ? 'Adding...' : 'Add to Cart'}
							</button>
							<button
								onclick={handleBack}
								class="w-full py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
							>
								Continue Shopping
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
