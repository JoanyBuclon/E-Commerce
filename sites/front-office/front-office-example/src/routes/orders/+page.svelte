<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { orderingService, authStore, isOrderingError, OrderStatus, type Order } from '$lib';
	import Header from '$lib/components/Header.svelte';

	let orders = $state<Order[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		// Redirect if not authenticated
		if (!authStore.isAuthenticated || !authStore.currentUser) {
			goto('/login');
			return;
		}

		await fetchOrders();
	});

	async function fetchOrders() {
		isLoading = true;
		error = null;

		try {
			const response = await orderingService.listOrders({
				userId: authStore.currentUser!.id
			});
			orders = response.orders;
		} catch (err) {
			if (isOrderingError(err)) {
				error = err.message;
			} else {
				error = 'Failed to load orders. Please try again.';
			}
		} finally {
			isLoading = false;
		}
	}

	function getStatusColorClass(status: OrderStatus): string {
		switch (status) {
			case OrderStatus.DELIVERED:
				return 'bg-green-100 text-green-800';
			case OrderStatus.SHIPPED:
				return 'bg-blue-100 text-blue-800';
			case OrderStatus.PREPARING:
				return 'bg-yellow-100 text-yellow-800';
			case OrderStatus.PAID:
				return 'bg-purple-100 text-purple-800';
			case OrderStatus.CANCELLED:
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>My Orders - E-Commerce</title>
</svelte:head>

<Header searchQuery="" onSearchChange={() => {}} />

<div class="min-h-screen bg-gray-50 pb-12">
	<!-- Page Title -->
	<div class="bg-white border-b">
		<div class="max-w-screen-2xl mx-auto px-4 py-6">
			<h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
		</div>
	</div>

	<!-- Content -->
	<div class="max-w-screen-2xl mx-auto px-4 py-8">
		{#if isLoading}
			<!-- Loading State -->
			<div class="text-center py-12">
				<div class="text-gray-600">Loading your orders...</div>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="bg-red-50 border border-red-200 rounded-lg p-4">
				<p class="text-red-800">{error}</p>
				<button
					onclick={fetchOrders}
					class="mt-2 text-red-600 hover:text-red-800 font-medium transition-colors"
				>
					Try Again
				</button>
			</div>
		{:else if orders.length === 0}
			<!-- Empty State -->
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">📦</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
				<p class="text-gray-600 mb-6">Start shopping to see your orders here!</p>
				<a
					href="/"
					class="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
				>
					Continue Shopping
				</a>
			</div>
		{:else}
			<!-- Orders List -->
			<div class="space-y-4">
				{#each orders as order (order.id)}
					<div class="bg-white rounded-lg shadow-md p-6">
						<!-- Order Header -->
						<div class="flex justify-between items-start mb-4">
							<div>
								<h3 class="text-lg font-semibold text-gray-900">
									Order #{order.id.slice(0, 8)}
								</h3>
								<p class="text-sm text-gray-600">
									Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>

							<!-- Status Badge -->
							<span
								class="{getStatusColorClass(order.status)} px-3 py-1 rounded-full text-sm font-medium"
							>
								{order.status}
							</span>
						</div>

						<!-- Order Details -->
						<div class="border-t pt-4">
							<div class="flex justify-between text-sm">
								<span class="text-gray-600">{order.items.length} item(s)</span>
								<span class="text-gray-900 font-semibold">
									${order.totalAmount.toFixed(2)}
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
