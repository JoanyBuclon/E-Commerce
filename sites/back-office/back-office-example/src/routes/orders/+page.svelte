<script lang="ts">
	import { onMount } from 'svelte';
	import { orderingService, type Order, OrderStatus } from '$lib';

	let orders = $state<Order[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let updatingOrderId = $state<string | null>(null);

	onMount(async () => {
		await loadOrders();
	});

	async function loadOrders() {
		isLoading = true;
		error = null;
		try {
			const response = await orderingService.listOrders();
			orders = response.orders;
		} catch (err) {
			error = 'Impossible de charger les commandes';
			console.error(err);
		} finally {
			isLoading = false;
		}
	}

	async function updateStatus(orderId: string, newStatus: OrderStatus) {
		updatingOrderId = orderId;
		try {
			const updatedOrder = await orderingService.updateOrderStatus(orderId, { status: newStatus });
			// Update local state
			orders = orders.map((order) => (order.id === orderId ? updatedOrder : order));
		} catch (err) {
			console.error('Failed to update order status:', err);
			alert('Échec de la mise à jour du statut');
		} finally {
			updatingOrderId = null;
		}
	}

	function getStatusColor(status: OrderStatus): string {
		const colors = {
			CREATED: 'bg-gray-100 text-gray-800',
			ORDERED: 'bg-blue-100 text-blue-800',
			PAID: 'bg-green-100 text-green-800',
			PREPARING: 'bg-yellow-100 text-yellow-800',
			SHIPPED: 'bg-purple-100 text-purple-800',
			DELIVERED: 'bg-green-600 text-white',
			CANCELLED: 'bg-red-100 text-red-800'
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	}

	function getStatusLabel(status: OrderStatus): string {
		const labels = {
			CREATED: 'Créée',
			ORDERED: 'Confirmée',
			PAID: 'Payée',
			PREPARING: 'Préparation',
			SHIPPED: 'Expédiée',
			DELIVERED: 'Livrée',
			CANCELLED: 'Annulée'
		};
		return labels[status] || status;
	}
</script>

<svelte:head>
	<title>Commandes - Back-Office</title>
</svelte:head>

<div class="p-8">
	<div class="max-w-screen-2xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
			<p class="text-gray-600 mt-1">Consultez et gérez toutes les commandes clients</p>
		</div>

		{#if isLoading}
			<!-- Loading State -->
			<div class="text-center py-12">
				<div class="text-gray-600">Chargement des commandes...</div>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<p class="text-red-800">{error}</p>
				<button
					onclick={loadOrders}
					class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
				>
					Réessayer
				</button>
			</div>
		{:else if orders.length === 0}
			<!-- Empty State -->
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">🛒</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h2>
				<p class="text-gray-600">Les commandes apparaîtront ici une fois créées</p>
			</div>
		{:else}
			<!-- Orders Table -->
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Commande
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Utilisateur
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Articles
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Montant
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Statut
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Date
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each orders as order}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4">
									<div>
										<p class="font-medium text-gray-900">#{order.id.slice(0, 13)}</p>
										<p class="text-sm text-gray-500">{order.id}</p>
									</div>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-600">{order.userId}</p>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-900">
										{order.items.length} article{order.items.length > 1 ? 's' : ''}
									</p>
								</td>
								<td class="px-6 py-4">
									<p class="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
								</td>
								<td class="px-6 py-4">
									<select
										value={order.status}
										onchange={(e) => updateStatus(order.id, e.currentTarget.value as OrderStatus)}
										disabled={updatingOrderId === order.id}
										class="px-3 py-1 rounded-full text-xs font-semibold {getStatusColor(
											order.status
										)}
                           border-0 cursor-pointer hover:opacity-80 disabled:opacity-50"
									>
										<option value="CREATED">Créée</option>
										<option value="ORDERED">Confirmée</option>
										<option value="PAID">Payée</option>
										<option value="PREPARING">Préparation</option>
										<option value="SHIPPED">Expédiée</option>
										<option value="DELIVERED">Livrée</option>
										<option value="CANCELLED">Annulée</option>
									</select>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-600">
										{new Date(order.createdAt).toLocaleDateString('fr-FR')}
									</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Summary -->
			<div class="mt-4 text-sm text-gray-600">
				Total: {orders.length} commande{orders.length > 1 ? 's' : ''}
			</div>
		{/if}
	</div>
</div>
