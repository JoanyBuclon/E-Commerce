import type { Product } from '$lib/types/cataloging';

/**
 * Mock product data for development/testing
 * Used when VITE_FAKE_CATALOGING environment variable is set to 'true'
 */
export const mockProducts: Product[] = [
	{
		id: '1',
		name: 'Laptop Pro 15"',
		description: 'High-performance laptop with 16GB RAM, 512GB SSD, and latest processor',
		price: 1299.99,
		createdAt: '2025-01-01T10:00:00Z',
		updatedAt: '2025-01-01T10:00:00Z'
	},
	{
		id: '2',
		name: 'Wireless Mouse',
		description: 'Ergonomic wireless mouse with precision tracking and long battery life',
		price: 29.99,
		createdAt: '2025-01-02T10:00:00Z',
		updatedAt: '2025-01-02T10:00:00Z'
	},
	{
		id: '3',
		name: 'Mechanical Keyboard RGB',
		description: 'Premium mechanical keyboard with RGB backlighting and tactile switches',
		price: 149.99,
		createdAt: '2025-01-03T10:00:00Z',
		updatedAt: '2025-01-03T10:00:00Z'
	},
	{
		id: '4',
		name: 'USB-C Hub',
		description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery',
		price: 49.99,
		createdAt: '2025-01-04T10:00:00Z',
		updatedAt: '2025-01-04T10:00:00Z'
	},
	{
		id: '5',
		name: 'Noise Cancelling Headphones',
		description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery',
		price: 299.99,
		createdAt: '2025-01-05T10:00:00Z',
		updatedAt: '2025-01-05T10:00:00Z'
	},
	{
		id: '6',
		name: 'Webcam 4K',
		description: '4K webcam with auto-focus, built-in microphone, and wide-angle lens',
		price: 89.99,
		createdAt: '2025-01-06T10:00:00Z',
		updatedAt: '2025-01-06T10:00:00Z'
	},
	{
		id: '7',
		name: 'Monitor 27" 4K',
		description: '27-inch 4K IPS monitor with HDR support and adjustable stand',
		price: 449.99,
		createdAt: '2025-01-07T10:00:00Z',
		updatedAt: '2025-01-07T10:00:00Z'
	},
	{
		id: '8',
		name: 'External SSD 1TB',
		description: 'Portable 1TB SSD with USB-C and USB 3.0, read speeds up to 1050MB/s',
		price: 129.99,
		createdAt: '2025-01-08T10:00:00Z',
		updatedAt: '2025-01-08T10:00:00Z'
	}
];

/**
 * Helper function to simulate API delay
 */
export function simulateDelay(ms: number = 300): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Search products by name (case-insensitive)
 */
export function searchMockProducts(name?: string): Product[] {
	if (!name || name.trim() === '') {
		return mockProducts;
	}

	const searchTerm = name.toLowerCase().trim();
	return mockProducts.filter((product) => product.name.toLowerCase().includes(searchTerm));
}

/**
 * Find product by ID
 */
export function findMockProduct(id: string): Product | undefined {
	return mockProducts.find((product) => product.id === id);
}
