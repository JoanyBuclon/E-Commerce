/**
 * Order status enum
 * Represents the lifecycle of an order
 */
export enum OrderStatus {
	CREATED = 'CREATED',
	ORDERED = 'ORDERED',
	PAID = 'PAID',
	PREPARING = 'PREPARING',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED',
	CANCELLED = 'CANCELLED'
}

/**
 * Order item representing a product in an order
 */
export interface OrderItem {
	productId: string;
	quantity: number;
	price: number;
}

/**
 * Request body for creating an order
 */
export interface CreateOrderRequest {
	userId: string; // UUID
	items: OrderItem[];
	totalAmount: number;
}

/**
 * Order entity
 */
export interface Order {
	id: string; // UUID
	userId: string; // UUID
	items: OrderItem[];
	totalAmount: number;
	status: OrderStatus;
	createdAt: string; // ISO date-time
}

/**
 * Query parameters for listing orders
 */
export interface ListOrdersParams {
	userId?: string; // Filter by user ID
}

/**
 * Response from GET /orders
 */
export interface OrderListResponse {
	orders: Order[];
}

/**
 * Response from GET /orders/:id
 */
export interface OrderDetailResponse {
	order: Order;
}

/**
 * Request body for updating order status
 */
export interface UpdateOrderStatusRequest {
	status: OrderStatus;
}

/**
 * Custom error for ordering service operations
 */
export class OrderingError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public originalError?: unknown
	) {
		super(message);
		this.name = 'OrderingError';
	}
}

/**
 * Type guard to check if error is an OrderingError
 */
export function isOrderingError(error: unknown): error is OrderingError {
	return error instanceof OrderingError;
}
