<script lang="ts">
	import { page } from '$app/stores';

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Dashboard', icon: '📊' },
		{ href: '/products', label: 'Produits', icon: '📦' },
		{ href: '/orders', label: 'Commandes', icon: '🛒' },
		{ href: '/shipments', label: 'Livraisons', icon: '🚚' }
	];

	// Check if route is active
	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<aside class="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
	<!-- Header -->
	<div class="p-6 border-b border-gray-800">
		<h1 class="text-2xl font-bold">Back-Office</h1>
		<p class="text-sm text-gray-400 mt-1">E-Commerce Admin</p>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 p-4">
		<ul class="space-y-2">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              {isActive(item.href)
							? 'bg-orange-600 text-white'
							: 'text-gray-300 hover:bg-gray-800'}"
					>
						<span class="text-xl">{item.icon}</span>
						<span class="font-medium">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Footer (User info) -->
	<div class="p-4 border-t border-gray-800">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
				<span class="text-white font-bold">A</span>
			</div>
			<div class="flex-1">
				<p class="text-sm font-medium">Admin User</p>
				<p class="text-xs text-gray-400">admin@example.com</p>
			</div>
		</div>
	</div>
</aside>
