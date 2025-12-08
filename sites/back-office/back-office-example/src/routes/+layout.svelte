<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen bg-gray-50">
	<!-- Sidebar Navigation -->
	<Sidebar />

	<!-- Main Content -->
	<main class="flex-1 overflow-auto">
		{@render children()}
	</main>
</div>
