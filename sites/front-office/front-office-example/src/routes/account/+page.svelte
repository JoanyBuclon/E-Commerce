<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib';
	import Header from '$lib/components/Header.svelte';

	// Redirect if not authenticated
	onMount(() => {
		if (!authStore.isAuthenticated) {
			goto('/login');
		}
	});
</script>

<svelte:head>
	<title>My Account - E-Commerce</title>
</svelte:head>

<Header searchQuery="" onSearchChange={() => {}} />

<div class="min-h-screen bg-gray-50 pb-12">
	<!-- Page Title -->
	<div class="bg-white border-b">
		<div class="max-w-screen-2xl mx-auto px-4 py-6">
			<h1 class="text-3xl font-bold text-gray-900">My Account</h1>
		</div>
	</div>

	<!-- Content -->
	<div class="max-w-screen-2xl mx-auto px-4 py-8">
		{#if authStore.currentUser}
			<!-- Profile Card -->
			<div class="bg-white rounded-lg shadow-md p-6 max-w-2xl">
				<h2 class="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

				<div class="space-y-4">
					<!-- Name -->
					<div>
						<label class="text-sm font-medium text-gray-600">Full Name</label>
						<p class="text-lg text-gray-900">
							{authStore.currentUser.firstName}
							{authStore.currentUser.lastName}
						</p>
					</div>

					<!-- Email -->
					<div>
						<label class="text-sm font-medium text-gray-600">Email Address</label>
						<p class="text-lg text-gray-900">{authStore.currentUser.email}</p>
					</div>

					<!-- User ID (for dev reference) -->
					<div>
						<label class="text-sm font-medium text-gray-600">Account ID</label>
						<p class="text-sm text-gray-500 font-mono">{authStore.currentUser.id}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
