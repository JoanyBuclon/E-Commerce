<script lang="ts">
	import type { Product } from '$lib/types/cataloging';
	import ProductImage from './ProductImage.svelte';

	interface ProductCardProps {
		product: Product;
	}

	let { product }: ProductCardProps = $props();
</script>

<a href="/products/{product.id}" class="block group">
	<article
		class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
	>
		<ProductImage {product} />
		<div class="p-4">
			<h3 class="text-base text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-orange-600 transition-colors">
				{product.name}
			</h3>
			<p class="text-lg font-bold text-gray-900 mt-2">
				${product.price.toFixed(2)}
			</p>
		</div>
	</article>
</a>
