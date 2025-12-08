<script lang="ts">
	import { goto } from '$app/navigation';
	import { cartStore, authStore, orderingService, isOrderingError } from '$lib';
	import type { CreateOrderRequest, OrderItem } from '$lib';
	import ProductImage from '$lib/components/ProductImage.svelte';
	import Header from '$lib/components/Header.svelte';

	let isProcessingCheckout = $state(false);
	let checkoutError = $state<string | null>(null);

	function handleIncrement(productId: string) {
		cartStore.incrementItem(productId);
	}

	function handleDecrement(productId: string) {
		cartStore.decrementItem(productId);
	}

	function handleRemove(productId: string) {
		cartStore.removeItem(productId);
	}

	function handleContinueShopping() {
		goto('/');
	}

	async function handleCheckout() {
		// Check if user is authenticated
		if (!authStore.isAuthenticated || !authStore.currentUser) {
			// Redirect to login page
			goto('/login');
			return;
		}

		// Check if cart is not empty
		if (cartStore.isEmpty) {
			return;
		}

		isProcessingCheckout = true;
		checkoutError = null;

		try {
			// Prepare order items from cart
			const orderItems: OrderItem[] = cartStore.items.map((cartItem) => ({
				productId: cartItem.product.id,
				quantity: cartItem.quantity,
				price: cartItem.product.price
			}));

			// Create order request
			const orderRequest: CreateOrderRequest = {
				userId: authStore.currentUser.id,
				items: orderItems,
				totalAmount: cartStore.totalPrice
			};

			// Create order via ordering service
			const order = await orderingService.createOrder(orderRequest);

			// Clear cart after successful order
			cartStore.clearCart();

			// Redirect to order confirmation or orders list
			// For now, show success message
			alert(`Order created successfully! Order ID: ${order.id}\nStatus: ${order.status}`);

			// Navigate to home page (or could navigate to an orders page)
			goto('/');
		} catch (err) {
			if (isOrderingError(err)) {
				checkoutError = err.message;
			} else {
				checkoutError = 'Failed to create order. Please try again.';
			}
		} finally {
			isProcessingCheckout = false;
		}
	}
</script>

<svelte:head>
	<title>Shopping Cart - E-Commerce</title>
</svelte:head>

<Header searchQuery="" onSearchChange={() => {}} />

<div class="min-h-screen bg-gray-50 pb-12">
	<!-- Page Title -->
	<div class="bg-white border-b">
		<div class="max-w-screen-2xl mx-auto px-4 py-6">
			<h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
			{#if !cartStore.isEmpty}
				<p class="text-gray-600 mt-1">
					{cartStore.totalItems} {cartStore.totalItems === 1 ? 'item' : 'items'} in your cart
				</p>
			{/if}
		</div>
	</div>

	<div class="max-w-screen-2xl mx-auto px-4 py-8">
		{#if cartStore.isEmpty}
			<!-- Empty State -->
			<div class="bg-white rounded-lg shadow-md p-12 text-center">
				<div class="text-6xl mb-4">🛒</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
				<p class="text-gray-600 mb-6">Add some products to get started!</p>
				<button
					onclick={handleContinueShopping}
					class="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-200"
				>
					Continue Shopping
				</button>
			</div>
		{:else}
			<!-- Cart Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Cart Items -->
				<div class="lg:col-span-2 space-y-4">
					{#each cartStore.items as item (item.product.id)}
						<div class="bg-white rounded-lg shadow-md p-4 flex gap-4">
							<!-- Product Image -->
							<div class="w-24 h-24 flex-shrink-0">
								<a href="/products/{item.product.id}">
									<ProductImage product={item.product} alt={item.product.name} />
								</a>
							</div>

							<!-- Product Details -->
							<div class="flex-1 min-w-0">
								<a
									href="/products/{item.product.id}"
									class="font-semibold text-gray-900 hover:text-orange-600 transition-colors block"
								>
									{item.product.name}
								</a>
								<p class="text-gray-600 text-sm mt-1">${item.product.price.toFixed(2)} each</p>

								<!-- Quantity Controls -->
								<div class="flex items-center gap-3 mt-3">
									<button
										onclick={() => handleDecrement(item.product.id)}
										class="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
										aria-label="Decrease quantity"
									>
										-
									</button>
									<span class="font-medium min-w-[2rem] text-center">{item.quantity}</span>
									<button
										onclick={() => handleIncrement(item.product.id)}
										class="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
										aria-label="Increase quantity"
									>
										+
									</button>
								</div>
							</div>

							<!-- Price & Remove -->
							<div class="flex flex-col items-end justify-between">
								<p class="font-bold text-lg text-gray-900">
									${(item.product.price * item.quantity).toFixed(2)}
								</p>
								<button
									onclick={() => handleRemove(item.product.id)}
									class="text-red-600 hover:text-red-800 text-sm transition-colors"
									aria-label="Remove item"
								>
									Remove
								</button>
							</div>
						</div>
					{/each}
				</div>

				<!-- Cart Summary -->
				<div class="lg:col-span-1">
					<div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
						<h2 class="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

						<div class="space-y-3 mb-6">
							<div class="flex justify-between text-gray-600">
								<span>Items ({cartStore.totalItems})</span>
								<span>${cartStore.totalPrice.toFixed(2)}</span>
							</div>
							<div class="border-t pt-3 flex justify-between font-bold text-lg">
								<span>Total</span>
								<span class="text-orange-600">${cartStore.totalPrice.toFixed(2)}</span>
							</div>
						</div>

						{#if checkoutError}
							<div class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p class="text-red-800 text-sm">{checkoutError}</p>
							</div>
						{/if}

						{#if !authStore.isAuthenticated}
							<div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
								<p class="text-blue-800 text-sm">Please sign in to proceed with checkout</p>
							</div>
						{/if}

						<button
							onclick={handleCheckout}
							disabled={isProcessingCheckout}
							class="w-full py-3 px-6 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-200 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isProcessingCheckout ? 'Processing...' : 'Proceed to Checkout'}
						</button>

						<button
							onclick={handleContinueShopping}
							class="w-full py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
						>
							Continue Shopping
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
