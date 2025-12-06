<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore, cartStore } from '$lib';
	import SearchBar from './SearchBar.svelte';

	interface HeaderProps {
		searchQuery: string;
		onSearchChange: (query: string) => void;
	}

	let { searchQuery, onSearchChange }: HeaderProps = $props();

	async function handleLogout() {
		await authStore.logout();
		goto('/');
	}

	function handleCartClick() {
		goto('/cart');
	}
</script>

<header class="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
	<div class="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-4">
		<!-- Logo -->
		<a href="/" class="flex-shrink-0">
			<h1 class="text-xl font-bold text-orange-500 hover:text-orange-400 transition-colors duration-200 cursor-pointer">
				E-Commerce
			</h1>
		</a>

		<!-- Search Bar -->
		<SearchBar value={searchQuery} onInput={onSearchChange} />

		<!-- Navigation Links (authenticated only) -->
		{#if authStore.isAuthenticated}
			<div class="flex items-center gap-4 flex-shrink-0">
				<a
					href="/orders"
					class="text-sm font-medium hover:text-orange-500 transition-colors duration-200"
				>
					Orders
				</a>
				<a
					href="/account"
					class="text-sm font-medium hover:text-orange-500 transition-colors duration-200"
				>
					Account
				</a>
			</div>
		{/if}

		<!-- Cart -->
		<div
			class="flex-shrink-0 relative cursor-pointer hover:text-orange-500 transition-colors duration-200"
			onclick={handleCartClick}
		>
			<span class="text-2xl">🛒</span>
			{#if cartStore.totalItems > 0}
				<span
					class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
				>
					{cartStore.totalItems}
				</span>
			{/if}
		</div>

		<!-- Auth -->
		<div class="flex-shrink-0 ml-2">
			{#if authStore.isAuthenticated}
				<div class="flex items-center gap-3">
					<span class="text-sm">
						Hello, <span class="font-medium text-orange-500">{authStore.currentUser?.firstName}</span>
					</span>
					<button
						onclick={handleLogout}
						class="text-sm px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors duration-200"
					>
						Logout
					</button>
				</div>
			{:else}
				<a
					href="/login"
					class="text-sm px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 transition-colors duration-200 font-medium"
				>
					Sign In
				</a>
			{/if}
		</div>
	</div>
</header>
