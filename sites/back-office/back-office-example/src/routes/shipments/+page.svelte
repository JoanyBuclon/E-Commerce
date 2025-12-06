<script lang="ts">
	import { onMount } from 'svelte';
	import { shippingService, type Shipment, ShippingStatus } from '$lib';

	let shipments = $state<Shipment[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let updatingShipmentId = $state<string | null>(null);

	onMount(async () => {
		await loadShipments();
	});

	async function loadShipments() {
		isLoading = true;
		error = null;
		try {
			// Note: shippingService doesn't have listShipments, only getShipmentById
			// We'll need to get all mock shipments
			// For now, we'll manually fetch the known shipment IDs from mocks
			const shipmentIds = ['shipment-uuid-001', 'shipment-uuid-002', 'shipment-uuid-003'];
			const shipmentPromises = shipmentIds.map((id) =>
				shippingService.getShipmentById(id).catch(() => null)
			);
			const results = await Promise.all(shipmentPromises);
			shipments = results.filter((s) => s !== null) as Shipment[];
		} catch (err) {
			error = 'Impossible de charger les livraisons';
			console.error(err);
		} finally {
			isLoading = false;
		}
	}

	async function updateStatus(shipmentId: string, newStatus: ShippingStatus) {
		updatingShipmentId = shipmentId;
		try {
			const updatedShipment = await shippingService.updateShipmentStatus(shipmentId, {
				status: newStatus
			});
			// Update local state
			shipments = shipments.map((shipment) =>
				shipment.id === shipmentId ? updatedShipment : shipment
			);
		} catch (err) {
			console.error('Failed to update shipment status:', err);
			alert('Échec de la mise à jour du statut');
		} finally {
			updatingShipmentId = null;
		}
	}

	function getStatusColor(status: ShippingStatus): string {
		const colors = {
			PREPARING: 'bg-yellow-100 text-yellow-800',
			SHIPPED: 'bg-blue-100 text-blue-800',
			DELIVERED: 'bg-green-600 text-white',
			RETURNED: 'bg-red-100 text-red-800'
		};
		return colors[status] || 'bg-gray-100 text-gray-800';
	}

	function getStatusLabel(status: ShippingStatus): string {
		const labels = {
			PREPARING: 'Préparation',
			SHIPPED: 'En transit',
			DELIVERED: 'Livrée',
			RETURNED: 'Retournée'
		};
		return labels[status] || status;
	}

	function formatAddress(address: { street: string; city: string; zip: string }): string {
		return `${address.street}, ${address.zip} ${address.city}`;
	}
</script>

<svelte:head>
	<title>Livraisons - Back-Office</title>
</svelte:head>

<div class="p-8">
	<div class="max-w-screen-2xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Gestion des Livraisons</h1>
			<p class="text-gray-600 mt-1">Consultez et gérez toutes les livraisons en cours</p>
		</div>

		{#if isLoading}
			<!-- Loading State -->
			<div class="text-center py-12">
				<div class="text-gray-600">Chargement des livraisons...</div>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="bg-red-50 border border-red-200 rounded-lg p-6">
				<p class="text-red-800">{error}</p>
				<button
					onclick={loadShipments}
					class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
				>
					Réessayer
				</button>
			</div>
		{:else if shipments.length === 0}
			<!-- Empty State -->
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">🚚</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Aucune livraison</h2>
				<p class="text-gray-600">Les livraisons apparaîtront ici une fois créées</p>
			</div>
		{:else}
			<!-- Shipments Table -->
			<div class="bg-white rounded-lg shadow-md overflow-hidden">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Livraison
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Commande
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Adresse de livraison
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
						{#each shipments as shipment}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4">
									<div>
										<p class="font-medium text-gray-900">#{shipment.id.slice(0, 16)}</p>
										<p class="text-xs text-gray-500">{shipment.id}</p>
									</div>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-600 font-mono">{shipment.orderId}</p>
								</td>
								<td class="px-6 py-4">
									<div>
										<p class="text-sm text-gray-900">{shipment.address.street}</p>
										<p class="text-xs text-gray-500">
											{shipment.address.zip}
											{shipment.address.city}
										</p>
									</div>
								</td>
								<td class="px-6 py-4">
									<select
										value={shipment.status}
										onchange={(e) =>
											updateStatus(shipment.id, e.currentTarget.value as ShippingStatus)}
										disabled={updatingShipmentId === shipment.id}
										class="px-3 py-1 rounded-full text-xs font-semibold {getStatusColor(
											shipment.status
										)}
                           border-0 cursor-pointer hover:opacity-80 disabled:opacity-50"
									>
										<option value="PREPARING">Préparation</option>
										<option value="SHIPPED">En transit</option>
										<option value="DELIVERED">Livrée</option>
										<option value="RETURNED">Retournée</option>
									</select>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-600">
										{shipment.createdAt
											? new Date(shipment.createdAt).toLocaleDateString('fr-FR')
											: 'N/A'}
									</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Summary -->
			<div class="mt-4 text-sm text-gray-600">
				Total: {shipments.length} livraison{shipments.length > 1 ? 's' : ''}
			</div>
		{/if}
	</div>
</div>
