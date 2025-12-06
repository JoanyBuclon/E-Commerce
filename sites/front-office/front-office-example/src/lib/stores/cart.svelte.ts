import { browser } from '$app/environment';
import type { Product } from '$lib/types/cataloging';
import type { CartItem } from '$lib/types/cart';

/**
 * Cart Store
 * Manages global shopping cart state using Svelte 5 runes
 * Provides reactive state with localStorage persistence
 */
class CartStore {
	// Core state using $state rune (reactive)
	items = $state<CartItem[]>([]);

	// Derived computed values using $derived rune
	totalItems = $derived(this.items.reduce((sum, item) => sum + item.quantity, 0));

	totalPrice = $derived(
		this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
	);

	isEmpty = $derived(this.items.length === 0);

	/**
	 * Initialize cart store by loading from localStorage
	 * Call this on app startup (in root layout)
	 */
	initialize(): void {
		if (!browser) return;

		const savedCart = this.loadFromStorage();
		if (savedCart) {
			this.items = savedCart;
		}
	}

	/**
	 * Add product to cart or increment quantity if already exists
	 */
	addItem(product: Product, quantity: number = 1): void {
		const existingItem = this.items.find((item) => item.product.id === product.id);

		if (existingItem) {
			// Increment quantity of existing item
			existingItem.quantity += quantity;
		} else {
			// Add new item
			this.items.push({
				product,
				quantity,
				addedAt: new Date().toISOString()
			});
		}

		this.persistToStorage();
	}

	/**
	 * Update quantity of a cart item
	 */
	updateQuantity(productId: string, quantity: number): void {
		const item = this.items.find((item) => item.product.id === productId);

		if (item) {
			if (quantity <= 0) {
				this.removeItem(productId);
			} else {
				item.quantity = quantity;
				this.persistToStorage();
			}
		}
	}

	/**
	 * Increment item quantity by 1
	 */
	incrementItem(productId: string): void {
		const item = this.items.find((item) => item.product.id === productId);
		if (item) {
			item.quantity += 1;
			this.persistToStorage();
		}
	}

	/**
	 * Decrement item quantity by 1
	 */
	decrementItem(productId: string): void {
		const item = this.items.find((item) => item.product.id === productId);
		if (item) {
			if (item.quantity <= 1) {
				this.removeItem(productId);
			} else {
				item.quantity -= 1;
				this.persistToStorage();
			}
		}
	}

	/**
	 * Remove item from cart
	 */
	removeItem(productId: string): void {
		this.items = this.items.filter((item) => item.product.id !== productId);
		this.persistToStorage();
	}

	/**
	 * Clear entire cart
	 */
	clearCart(): void {
		this.items = [];
		this.persistToStorage();
	}

	/**
	 * Get quantity of specific product in cart
	 */
	getItemQuantity(productId: string): number {
		const item = this.items.find((item) => item.product.id === productId);
		return item ? item.quantity : 0;
	}

	/**
	 * Check if product is in cart
	 */
	hasItem(productId: string): boolean {
		return this.items.some((item) => item.product.id === productId);
	}

	// Private: Persist to localStorage
	private persistToStorage(): void {
		if (!browser) return;

		try {
			localStorage.setItem('shopping_cart', JSON.stringify(this.items));
		} catch (error) {
			console.error('Failed to persist cart to localStorage:', error);
		}
	}

	// Private: Load from localStorage
	private loadFromStorage(): CartItem[] | null {
		if (!browser) return null;

		try {
			const data = localStorage.getItem('shopping_cart');
			if (!data) return null;

			return JSON.parse(data) as CartItem[];
		} catch (error) {
			console.error('Failed to load cart from localStorage:', error);
			return null;
		}
	}
}

/**
 * Singleton instance of the cart store
 * Import and use this in your components
 */
export const cartStore = new CartStore();
