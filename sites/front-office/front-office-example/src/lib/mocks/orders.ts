import type { Order, CreateOrderRequest } from '$lib/types/ordering';
import { OrderStatus } from '$lib/types/ordering';

/**
 * Mock order data for development/testing
 * Used when VITE_FAKE_ORDERING environment variable is set to 'true'
 */
export const mockOrders: Order[] = [
	{
		id: 'order-uuid-001',
		userId: 'user-uuid-001',
		items: [
			{ productId: '1', quantity: 1, price: 1299.99 },
			{ productId: '2', quantity: 2, price: 29.99 }
		],
		totalAmount: 1359.97,
		status: OrderStatus.DELIVERED,
		createdAt: '2025-01-01T10:00:00Z'
	},
	{
		id: 'order-uuid-002',
		userId: 'user-uuid-001',
		items: [
			{ productId: '3', quantity: 1, price: 149.99 },
			{ productId: '5', quantity: 1, price: 299.99 }
		],
		totalAmount: 449.98,
		status: OrderStatus.SHIPPED,
		createdAt: '2025-01-05T14:30:00Z'
	},
	{
		id: 'order-uuid-003',
		userId: 'user-uuid-002',
		items: [{ productId: '7', quantity: 1, price: 449.99 }],
		totalAmount: 449.99,
		status: OrderStatus.PAID,
		createdAt: '2025-01-10T09:15:00Z'
	},
	{
		id: 'order-uuid-004',
		userId: 'user-uuid-001',
		items: [
			{ productId: '4', quantity: 1, price: 49.99 },
			{ productId: '6', quantity: 1, price: 89.99 }
		],
		totalAmount: 139.98,
		status: OrderStatus.ORDERED,
		createdAt: '2025-01-12T16:45:00Z'
	}
];

/**
 * Counter for generating mock order IDs
 */
let orderIdCounter = mockOrders.length + 1;

/**
 * Re-export the delay function from products for consistency
 */
export { simulateDelay } from './products';

/**
 * Find order by ID
 */
export function findMockOrderById(id: string): Order | undefined {
	return mockOrders.find((order) => order.id === id);
}

/**
 * Find orders by user ID
 */
export function findMockOrdersByUserId(userId: string): Order[] {
	return mockOrders.filter((order) => order.userId === userId);
}

/**
 * Create a new mock order
 */
export function createMockOrder(data: CreateOrderRequest): Order {
	const newOrder: Order = {
		id: `order-uuid-${String(orderIdCounter).padStart(3, '0')}`,
		userId: data.userId,
		items: data.items,
		totalAmount: data.totalAmount,
		status: OrderStatus.CREATED,
		createdAt: new Date().toISOString()
	};

	orderIdCounter++;

	// Add order to mock array
	mockOrders.push(newOrder);

	return newOrder;
}

/**
 * Update order status
 */
export function updateMockOrderStatus(orderId: string, status: OrderStatus): Order | null {
	const order = findMockOrderById(orderId);
	if (!order) return null;

	order.status = status;
	return order;
}
