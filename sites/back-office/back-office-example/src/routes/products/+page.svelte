<script lang="ts">
	import { onMount } from 'svelte';
	import { catalogingService, type Product } from '$lib';

	let products = $state<Product[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		await loadProducts();
	});

	async function loadProducts() {
		isLoading = true;
		error = null;

		try {
			const response = await catalogingService.getProducts();
			products = response.products;
		} catch (err) {
			error = 'Failed to load products';
			console.error(err);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Produits - Back-Office</title>
</svelte:head>

<div class="p-8">
	<div class="max-w-screen-2xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Catalogue Produits</h1>
				<p class="text-gray-600 mt-1">Gérez les produits de votre catalogue</p>
			</div>
			<a
				href="/products/new"
				class="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
			>
				+ Ajouter un produit
			</a>
		</div>

		{#if isLoading}
			<!-- Loading State -->
			<div class="text-center py-12">
				<div class="text-gray-600">Chargement des produits...</div>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<p class="text-red-800">{error}</p>
				<button
					onclick={loadProducts}
					class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
				>
					Réessayer
				</button>
			</div>
		{:else if products.length === 0}
			<!-- Empty State -->
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">📦</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Aucun produit</h2>
				<p class="text-gray-600 mb-6">Commencez par ajouter votre premier produit</p>
				<a
					href="/products/new"
					class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
				>
					Ajouter un produit
				</a>
			</div>
		{:else}
			<!-- Products Table -->
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Produit
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Description
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Prix
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each products as product}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										{#if product.imageUrl}
											<img
												src={product.imageUrl}
												alt={product.name}
												class="w-12 h-12 rounded object-cover"
											/>
										{:else}
											<div
												class="w-12 h-12 rounded bg-gray-200 flex items-center justify-center"
											>
												<span class="text-gray-500 text-xl">📦</span>
											</div>
										{/if}
										<div>
											<p class="font-medium text-gray-900">{product.name}</p>
											<p class="text-sm text-gray-500">ID: {product.id.slice(0, 8)}</p>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-600 line-clamp-2">{product.description}</p>
								</td>
								<td class="px-6 py-4">
									<p class="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
								</td>
								<td class="px-6 py-4">
									<div class="flex gap-2">
										<button
											class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
										>
											Voir
										</button>
										<button
											class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
										>
											Modifier
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Summary -->
			<div class="mt-4 text-sm text-gray-600">
				Total: {products.length} produit{products.length > 1 ? 's' : ''}
			</div>
		{/if}
	</div>
</div>
