import type { Payment, ProcessPaymentRequest } from '$lib/types/paying';

/**
 * Mock payment data for development/testing
 * Used when VITE_FAKE_PAYING environment variable is set to 'true'
 */
export const mockPayments: Payment[] = [
	{
		id: 'payment-uuid-001',
		orderId: 'order-uuid-001',
		amount: 1359.97,
		currency: 'EUR',
		paymentMethod: 'CREDIT_CARD',
		status: 'ACCEPTED',
		createdAt: '2025-01-01T10:05:00Z'
	},
	{
		id: 'payment-uuid-002',
		orderId: 'order-uuid-002',
		amount: 449.98,
		currency: 'EUR',
		paymentMethod: 'CREDIT_CARD',
		status: 'ACCEPTED',
		createdAt: '2025-01-05T14:35:00Z'
	},
	{
		id: 'payment-uuid-003',
		orderId: 'order-uuid-003',
		amount: 449.99,
		currency: 'EUR',
		paymentMethod: 'PAYPAL',
		status: 'ACCEPTED',
		createdAt: '2025-01-10T09:20:00Z'
	}
];

/**
 * Counter for generating mock payment IDs
 */
let paymentIdCounter = mockPayments.length + 1;

/**
 * Re-export the delay function from products for consistency
 */
export { simulateDelay } from './products';

/**
 * Find payment by ID
 */
export function findMockPaymentById(id: string): Payment | undefined {
	return mockPayments.find((payment) => payment.id === id);
}

/**
 * Find payments by order ID
 */
export function findMockPaymentsByOrderId(orderId: string): Payment[] {
	return mockPayments.filter((payment) => payment.orderId === orderId);
}

/**
 * Create a new mock payment
 * Always returns ACCEPTED status (simulates dev behavior)
 */
export function createMockPayment(data: ProcessPaymentRequest): Payment {
	const newPayment: Payment = {
		id: `payment-uuid-${String(paymentIdCounter).padStart(3, '0')}`,
		orderId: data.orderId,
		amount: data.amount,
		currency: data.currency,
		paymentMethod: data.paymentMethod,
		status: 'ACCEPTED', // Always accepted in mock mode (mirrors dev behavior)
		createdAt: new Date().toISOString()
	};

	paymentIdCounter++;

	// Add payment to mock array
	mockPayments.push(newPayment);

	return newPayment;
}
