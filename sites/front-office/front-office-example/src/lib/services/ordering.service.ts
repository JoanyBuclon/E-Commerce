import { orderingConfig } from '$lib/config/env';
import type {
	Order,
	CreateOrderRequest,
	ListOrdersParams,
	OrderListResponse,
	OrderDetailResponse,
	UpdateOrderStatusRequest
} from '$lib/types/ordering';
import { OrderingError, OrderStatus } from '$lib/types/ordering';
import {
	mockOrders,
	findMockOrderById,
	findMockOrdersByUserId,
	createMockOrder,
	updateMockOrderStatus,
	simulateDelay
} from '$lib/mocks/orders';

/**
 * Ordering Service
 * Provides methods to interact with the ordering API
 * Automatically switches between real API and mock data based on configuration
 */
class OrderingService {
	private readonly baseUrl: string;
	private readonly useFakeData: boolean;

	constructor() {
		this.baseUrl = orderingConfig.baseUrl;
		this.useFakeData = orderingConfig.useFakeData;
	}

	/**
	 * Create a new order
	 * @param data - Order creation data
	 * @returns Promise with created order
	 */
	async createOrder(data: CreateOrderRequest): Promise<Order> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.createOrderFake(data);
		}

		try {
			const response = await fetch(`${this.baseUrl}/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				throw new OrderingError(
					`Failed to create order: ${response.statusText}`,
					response.status
				);
			}

			// API returns 201 Created
			const order = await response.json();
			return order;
		} catch (error) {
			if (error instanceof OrderingError) {
				throw error;
			}

			throw new OrderingError('Failed to create order', undefined, error);
		}
	}

	/**
	 * Get list of orders with optional user filter
	 * @param params - Query parameters
	 * @returns Promise with order list
	 */
	async listOrders(params?: ListOrdersParams): Promise<OrderListResponse> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.listOrdersFake(params);
		}

		try {
			// Build query string
			const queryParams = new URLSearchParams();
			if (params?.userId) {
				queryParams.append('userId', params.userId);
			}

			const url = `${this.baseUrl}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new OrderingError(
					`Failed to fetch orders: ${response.statusText}`,
					response.status
				);
			}

			const data = await response.json();

			// Transform API response to match our interface
			// Assuming API returns array of orders directly
			const orders = Array.isArray(data) ? data : data.orders || [];

			return { orders };
		} catch (error) {
			if (error instanceof OrderingError) {
				throw error;
			}

			throw new OrderingError('Failed to fetch orders', undefined, error);
		}
	}

	/**
	 * Get order details by ID
	 * @param id - Order ID
	 * @returns Promise with order details
	 */
	async getOrderById(id: string): Promise<OrderDetailResponse> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.getOrderByIdFake(id);
		}

		try {
			const url = `${this.baseUrl}/orders/${encodeURIComponent(id)}`;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new OrderingError(`Order with ID ${id} not found`, 404);
				}

				throw new OrderingError(
					`Failed to fetch order: ${response.statusText}`,
					response.status
				);
			}

			const data = await response.json();

			// Transform API response to match our interface
			const order = data.order || data;

			return { order };
		} catch (error) {
			if (error instanceof OrderingError) {
				throw error;
			}

			throw new OrderingError(`Failed to fetch order ${id}`, undefined, error);
		}
	}

	/**
	 * Update order status
	 * @param id - Order ID
	 * @param data - Status update data
	 * @returns Promise with updated order
	 */
	async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<Order> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.updateOrderStatusFake(id, data);
		}

		try {
			const url = `${this.baseUrl}/orders/${encodeURIComponent(id)}/status`;

			const response = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new OrderingError(`Order with ID ${id} not found`, 404);
				}

				throw new OrderingError(
					`Failed to update order status: ${response.statusText}`,
					response.status
				);
			}

			const order = await response.json();
			return order;
		} catch (error) {
			if (error instanceof OrderingError) {
				throw error;
			}

			throw new OrderingError(`Failed to update order ${id}`, undefined, error);
		}
	}

	/**
	 * FAKE MODE: Create order using mock data
	 */
	private async createOrderFake(data: CreateOrderRequest): Promise<Order> {
		// Simulate network delay
		await simulateDelay(500);

		const newOrder = createMockOrder(data);
		return newOrder;
	}

	/**
	 * FAKE MODE: List orders using mock data
	 */
	private async listOrdersFake(params?: ListOrdersParams): Promise<OrderListResponse> {
		// Simulate network delay
		await simulateDelay(300);

		let orders = [...mockOrders];

		// Filter by userId if provided
		if (params?.userId) {
			orders = findMockOrdersByUserId(params.userId);
		}

		return { orders };
	}

	/**
	 * FAKE MODE: Get order by ID using mock data
	 */
	private async getOrderByIdFake(id: string): Promise<OrderDetailResponse> {
		// Simulate network delay
		await simulateDelay(200);

		const order = findMockOrderById(id);

		if (!order) {
			throw new OrderingError(`Order with ID ${id} not found`, 404);
		}

		return { order };
	}

	/**
	 * FAKE MODE: Update order status using mock data
	 */
	private async updateOrderStatusFake(
		id: string,
		data: UpdateOrderStatusRequest
	): Promise<Order> {
		// Simulate network delay
		await simulateDelay(300);

		const order = updateMockOrderStatus(id, data.status);

		if (!order) {
			throw new OrderingError(`Order with ID ${id} not found`, 404);
		}

		return order;
	}
}

/**
 * Singleton instance of the ordering service
 * Import and use this in your components
 */
export const orderingService = new OrderingService();

/**
 * Export the class for testing purposes
 */
export { OrderingService };
