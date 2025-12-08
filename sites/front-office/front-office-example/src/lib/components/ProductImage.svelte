<script lang="ts">
	import type { Product } from '$lib/types/cataloging';

	interface ProductImageProps {
		product: Product;
		alt?: string;
	}

	let { product, alt = product.name }: ProductImageProps = $props();

	const GRADIENTS = [
		'from-blue-400 to-purple-600',
		'from-green-400 to-teal-600',
		'from-orange-400 to-red-600',
		'from-pink-400 to-purple-600',
		'from-yellow-400 to-orange-600',
		'from-indigo-400 to-blue-600',
		'from-teal-400 to-green-600',
		'from-red-400 to-pink-600'
	];

	function getGradientForProduct(productId: string): string {
		const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return GRADIENTS[hash % GRADIENTS.length];
	}

	function getProductInitial(name: string): string {
		return name.charAt(0).toUpperCase();
	}

	const gradient = getGradientForProduct(product.id);
	const initial = getProductInitial(product.name);
</script>

{#if product.imageUrl}
	<img src={product.imageUrl} {alt} class="aspect-[3/4] w-full object-cover" />
{:else}
	<div class="aspect-[3/4] bg-gradient-to-br {gradient} flex items-center justify-center">
		<span class="text-white text-6xl font-bold">{initial}</span>
	</div>
{/if}
