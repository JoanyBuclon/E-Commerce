import { catalogingConfig } from '$lib/config/env';
import type {
	Product,
	ProductListParams,
	ProductListResponse,
	ProductDetailResponse
} from '$lib/types/cataloging';
import { CatalogingError } from '$lib/types/cataloging';
import {
	mockProducts,
	searchMockProducts,
	findMockProduct,
	simulateDelay
} from '$lib/mocks/products';

/**
 * Cataloging Service
 * Provides methods to interact with the cataloging API
 * Automatically switches between real API and mock data based on configuration
 */
class CatalogingService {
	private readonly baseUrl: string;
	private readonly useFakeData: boolean;

	constructor() {
		this.baseUrl = catalogingConfig.baseUrl;
		this.useFakeData = catalogingConfig.useFakeData;
	}

	/**
	 * Get list of products with optional name filter
	 * @param params - Query parameters
	 * @returns Promise with product list
	 */
	async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.getProductsFake(params);
		}

		try {
			// Build query string
			const queryParams = new URLSearchParams();
			if (params?.name) {
				queryParams.append('name', params.name);
			}

			const url = `${this.baseUrl}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new CatalogingError(
					`Failed to fetch products: ${response.statusText}`,
					response.status
				);
			}

			const data = await response.json();

			// Transform API response to match our interface
			// Assuming API returns { products: Product[] } or Product[]
			const products = Array.isArray(data) ? data : data.products || [];

			return {
				products,
				total: products.length
			};
		} catch (error) {
			if (error instanceof CatalogingError) {
				throw error;
			}

			throw new CatalogingError('Failed to fetch products', undefined, error);
		}
	}

	/**
	 * Get product details by ID
	 * @param id - Product ID
	 * @returns Promise with product details
	 */
	async getProductById(id: string): Promise<ProductDetailResponse> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.getProductByIdFake(id);
		}

		try {
			const url = `${this.baseUrl}/products/${encodeURIComponent(id)}`;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new CatalogingError(`Product with ID ${id} not found`, 404);
				}

				throw new CatalogingError(
					`Failed to fetch product: ${response.statusText}`,
					response.status
				);
			}

			const data = await response.json();

			// Transform API response to match our interface
			// Assuming API returns { product: Product } or Product
			const product = data.product || data;

			return { product };
		} catch (error) {
			if (error instanceof CatalogingError) {
				throw error;
			}

			throw new CatalogingError(`Failed to fetch product ${id}`, undefined, error);
		}
	}

	/**
	 * FAKE MODE: Get products using mock data
	 */
	private async getProductsFake(params?: ProductListParams): Promise<ProductListResponse> {
		// Simulate network delay
		await simulateDelay(300);

		const products = searchMockProducts(params?.name);

		return {
			products,
			total: products.length
		};
	}

	/**
	 * FAKE MODE: Get product by ID using mock data
	 */
	private async getProductByIdFake(id: string): Promise<ProductDetailResponse> {
		// Simulate network delay
		await simulateDelay(200);

		const product = findMockProduct(id);

		if (!product) {
			throw new CatalogingError(`Product with ID ${id} not found`, 404);
		}

		return { product };
	}
}

/**
 * Singleton instance of the cataloging service
 * Import and use this in your components
 */
export const catalogingService = new CatalogingService();

/**
 * Export the class for testing purposes
 */
export { CatalogingService };
