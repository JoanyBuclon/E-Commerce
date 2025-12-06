/**
 * Product entity representing a catalog item
 */
export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	imageUrl?: string;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Query parameters for listing products
 */
export interface ProductListParams {
	name?: string; // Optional search by name
}

/**
 * Response from GET /products
 */
export interface ProductListResponse {
	products: Product[];
	total: number;
}

/**
 * Response from GET /products/:id
 */
export interface ProductDetailResponse {
	product: Product;
}

/**
 * Request body for POST /products
 */
export interface CreateProductRequest {
	name: string;
	description: string;
	price: number;
	imageUrl?: string;
}

/**
 * Response from POST /products
 */
export interface CreateProductResponse {
	product: Product;
}

/**
 * Custom error for cataloging service operations
 */
export class CatalogingError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public originalError?: unknown
	) {
		super(message);
		this.name = 'CatalogingError';
	}
}

/**
 * Type guard to check if error is a CatalogingError
 */
export function isCatalogingError(error: unknown): error is CatalogingError {
	return error instanceof CatalogingError;
}
