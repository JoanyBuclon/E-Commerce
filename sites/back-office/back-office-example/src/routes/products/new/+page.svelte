<script lang="ts">
	import { goto } from '$app/navigation';
	import { catalogingService, type CreateProductRequest } from '$lib';

	// Form state
	let name = $state('');
	let description = $state('');
	let price = $state<number | ''>('');
	let imageUrl = $state('');

	let isSubmitting = $state(false);
	let error = $state<string | null>(null);

	// Validation
	const isValid = $derived(
		name.trim().length > 0 && description.trim().length > 0 && typeof price === 'number' && price > 0
	);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!isValid) {
			error = 'Veuillez remplir tous les champs obligatoires';
			return;
		}

		isSubmitting = true;
		error = null;

		try {
			const productData: CreateProductRequest = {
				name: name.trim(),
				description: description.trim(),
				price: price as number,
				imageUrl: imageUrl.trim() || undefined
			};

			const response = await catalogingService.createProduct(productData);

			console.log('Product created successfully:', response.product);

			// Redirect to products list
			goto('/products');
		} catch (err) {
			error = 'Échec de la création du produit. Veuillez réessayer.';
			console.error(err);
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		goto('/products');
	}
</script>

<svelte:head>
	<title>Ajouter un Produit - Back-Office</title>
</svelte:head>

<div class="p-8">
	<div class="max-w-3xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<a
				href="/products"
				class="text-orange-600 hover:text-orange-700 font-medium mb-4 inline-block"
			>
				← Retour au catalogue
			</a>
			<h1 class="text-3xl font-bold text-gray-900">Ajouter un Produit</h1>
			<p class="text-gray-600 mt-1">Créez un nouveau produit dans le catalogue</p>
		</div>

		<!-- Form -->
		<form onsubmit={handleSubmit} class="bg-white rounded-lg shadow-md p-8">
			<!-- Error Message -->
			{#if error}
				<div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-red-800">{error}</p>
				</div>
			{/if}

			<!-- Name Field -->
			<div class="mb-6">
				<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
					Nom du produit <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
					placeholder="Ex: Laptop Pro 15"
					required
				/>
			</div>

			<!-- Description Field -->
			<div class="mb-6">
				<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
					Description <span class="text-red-500">*</span>
				</label>
				<textarea
					id="description"
					bind:value={description}
					rows="4"
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
					placeholder="Décrivez le produit..."
					required
				></textarea>
			</div>

			<!-- Price Field -->
			<div class="mb-6">
				<label for="price" class="block text-sm font-medium text-gray-700 mb-2">
					Prix (USD) <span class="text-red-500">*</span>
				</label>
				<div class="relative">
					<span class="absolute left-4 top-2 text-gray-500">$</span>
					<input
						type="number"
						id="price"
						bind:value={price}
						min="0"
						step="0.01"
						class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						placeholder="0.00"
						required
					/>
				</div>
			</div>

			<!-- Image URL Field -->
			<div class="mb-8">
				<label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
					URL de l'image (optionnel)
				</label>
				<input
					type="url"
					id="imageUrl"
					bind:value={imageUrl}
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
					placeholder="https://example.com/image.jpg"
				/>
				<p class="text-xs text-gray-500 mt-1">Laissez vide pour utiliser l'image par défaut</p>
			</div>

			<!-- Form Actions -->
			<div class="flex gap-4">
				<button
					type="submit"
					disabled={!isValid || isSubmitting}
					class="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg
            hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors"
				>
					{isSubmitting ? 'Création en cours...' : 'Créer le produit'}
				</button>
				<button
					type="button"
					onclick={handleCancel}
					disabled={isSubmitting}
					class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
				>
					Annuler
				</button>
			</div>
		</form>

		<!-- Info Box -->
		<div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
			<p class="text-sm text-blue-800">
				<strong>Note:</strong> En mode fake data, les produits créés sont ajoutés aux mocks et
				resteront disponibles jusqu'au rechargement de la page. Pour une persistance permanente,
				configurez l'API réelle dans le fichier <code class="bg-blue-100 px-1 rounded">.env</code>.
			</p>
		</div>
	</div>
</div>
