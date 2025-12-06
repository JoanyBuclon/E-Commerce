<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, cartStore } from '$lib';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	// Initialize stores on app startup
	onMount(async () => {
		await authStore.initialize();
		cartStore.initialize();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
