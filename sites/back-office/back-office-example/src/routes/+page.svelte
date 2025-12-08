<script lang="ts">
	import { onMount } from 'svelte';
	import {
		catalogingService,
		orderingService,
		shippingService,
		type Product,
		type Order,
		type Shipment
	} from '$lib';

	let products = $state<Product[]>([]);
	let orders = $state<Order[]>([]);
	let shipments = $state<Shipment[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			// Fetch data from services (using fake data)
			const [productsData, ordersData] = await Promise.all([
				catalogingService.getProducts(),
				orderingService.listOrders()
			]);

			products = productsData.products;
			orders = ordersData.orders;

			// Get first shipment if available
			if (orders.length > 0) {
				try {
					const firstShipment = await shippingService.getShipmentById('shipment-001');
					shipments = [firstShipment];
				} catch {
					// No shipment found, that's ok
				}
			}
		} catch (error) {
			console.error('Failed to load data:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Back-Office - Dashboard</title>
</svelte:head>

<div class="p-8">
	<div class="max-w-screen-2xl mx-auto">
		<h1 class="text-4xl font-bold text-gray-900 mb-2">Back-Office Dashboard</h1>
		<p class="text-gray-600 mb-8">Services opérationnels avec fake data activée</p>

		{#if isLoading}
			<div class="text-center py-12">
				<div class="text-gray-600">Chargement des données...</div>
			</div>
		{:else}
			<!-- Statistics Cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<!-- Products Card -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">Produits</h2>
						<span class="text-3xl">📦</span>
					</div>
					<p class="text-3xl font-bold text-orange-600">{products.length}</p>
					<p class="text-sm text-gray-600 mt-1">Dans le catalogue</p>
				</div>

				<!-- Orders Card -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">Commandes</h2>
						<span class="text-3xl">🛒</span>
					</div>
					<p class="text-3xl font-bold text-blue-600">{orders.length}</p>
					<p class="text-sm text-gray-600 mt-1">Commandes totales</p>
				</div>

				<!-- Shipments Card -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900">Livraisons</h2>
						<span class="text-3xl">🚚</span>
					</div>
					<p class="text-3xl font-bold text-green-600">{shipments.length}</p>
					<p class="text-sm text-gray-600 mt-1">Livraisons en cours</p>
				</div>
			</div>

			<!-- Products Section -->
			<div class="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 class="text-xl font-bold text-gray-900 mb-4">
					Catalogue Produits (Cataloging Service)
				</h2>
				<div class="space-y-2">
					{#each products.slice(0, 5) as product}
						<div class="flex justify-between items-center p-3 bg-gray-50 rounded">
							<div>
								<p class="font-medium text-gray-900">{product.name}</p>
								<p class="text-sm text-gray-600">{product.description}</p>
							</div>
							<p class="font-semibold text-orange-600">${product.price.toFixed(2)}</p>
						</div>
					{/each}
				</div>
				{#if products.length > 5}
					<p class="text-sm text-gray-600 mt-4">
						Et {products.length - 5} autres produits...
					</p>
				{/if}
			</div>

			<!-- Orders Section -->
			<div class="bg-white rounded-lg shadow-md p-6 mb-6">
				<h2 class="text-xl font-bold text-gray-900 mb-4">
					Commandes Récentes (Ordering Service)
				</h2>
				<div class="space-y-2">
					{#each orders.slice(0, 5) as order}
						<div class="flex justify-between items-center p-3 bg-gray-50 rounded">
							<div>
								<p class="font-medium text-gray-900">Commande #{order.id.slice(0, 8)}</p>
								<p class="text-sm text-gray-600">
									{order.items.length} article(s) - Status: {order.status}
								</p>
							</div>
							<p class="font-semibold text-blue-600">${order.totalAmount.toFixed(2)}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Info Box -->
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
				<h3 class="text-lg font-semibold text-blue-900 mb-2">
					✅ Services opérationnels en mode fake data
				</h3>
				<ul class="text-sm text-blue-800 space-y-1">
					<li>✓ <strong>Cataloging Service</strong> - {products.length} produits chargés</li>
					<li>✓ <strong>Ordering Service</strong> - {orders.length} commandes chargées</li>
					<li>✓ <strong>Shipping Service</strong> - Prêt pour gestion livraisons</li>
					<li>
						✓ <strong>Auth Store</strong> - Login admin: admin@example.com / admin123 (hardcodé)
					</li>
				</ul>
				<p class="text-sm text-blue-700 mt-4">
					<strong>Note:</strong> Les données affichées proviennent des fichiers mocks. Pour utiliser
					les vrais microservices, modifiez le fichier <code
						class="bg-blue-100 px-1 rounded">.env</code
					>
				</p>
			</div>
		{/if}
	</div>
</div>
