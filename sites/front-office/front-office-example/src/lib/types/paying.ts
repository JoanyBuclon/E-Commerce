/**
 * Payment request model for processing a payment
 */
export interface ProcessPaymentRequest {
	orderId: string; // UUID
	amount: number;
	currency: string; // Default: "EUR"
	paymentMethod: string;
}

/**
 * Payment response model
 */
export interface Payment {
	id: string; // UUID
	orderId: string; // UUID
	amount: number;
	currency: string;
	paymentMethod: string;
	status: 'ACCEPTED' | 'REFUSED';
	createdAt: string; // ISO date-time
}

/**
 * Custom error for paying service operations
 */
export class PayingError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public originalError?: unknown
	) {
		super(message);
		this.name = 'PayingError';
	}
}

/**
 * Type guard to check if error is a PayingError
 */
export function isPayingError(error: unknown): error is PayingError {
	return error instanceof PayingError;
}
