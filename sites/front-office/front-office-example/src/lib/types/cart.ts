import type { Product } from './cataloging';

/**
 * Cart item representing a product with quantity
 */
export interface CartItem {
	product: Product;
	quantity: number;
	addedAt: string; // ISO timestamp
}

/**
 * Cart summary for display purposes
 */
export interface CartSummary {
	totalItems: number; // Total quantity across all items
	totalPrice: number; // Sum of (price * quantity) for all items
	itemCount: number; // Number of unique products
}
