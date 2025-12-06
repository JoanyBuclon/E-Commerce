import { browser } from '$app/environment';
import { payingConfig } from '$lib/config/env';
import type { ProcessPaymentRequest, Payment } from '$lib/types/paying';
import { PayingError } from '$lib/types/paying';
import { createMockPayment, simulateDelay } from '$lib/mocks/payments';

/**
 * Paying service for processing payments
 * Supports both real API calls and mock data mode
 */
class PayingService {
	private readonly baseUrl: string;
	private readonly useFakeData: boolean;

	constructor() {
		this.baseUrl = payingConfig.baseUrl;
		this.useFakeData = payingConfig.useFakeData;
	}

	/**
	 * Process a payment for an order
	 * In mock mode, always returns ACCEPTED status (simulates dev behavior)
	 */
	async processPayment(data: ProcessPaymentRequest): Promise<Payment> {
		if (this.useFakeData) {
			return this.processPaymentFake(data);
		}

		return this.processPaymentReal(data);
	}

	/**
	 * Process payment using mock data (always succeeds)
	 */
	private async processPaymentFake(data: ProcessPaymentRequest): Promise<Payment> {
		// Simulate network delay
		await simulateDelay(400);

		// Create and return mock payment (always ACCEPTED)
		return createMockPayment(data);
	}

	/**
	 * Process payment using real API
	 */
	private async processPaymentReal(data: ProcessPaymentRequest): Promise<Payment> {
		if (!browser) {
			throw new PayingError('Cannot process payment on server side');
		}

		try {
			const response = await fetch(`${this.baseUrl}/payments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new PayingError(
					`Failed to process payment: ${response.statusText}`,
					response.status
				);
			}

			const payment: Payment = await response.json();
			return payment;
		} catch (err) {
			if (err instanceof PayingError) {
				throw err;
			}

			throw new PayingError('Failed to process payment', undefined, err);
		}
	}
}

/**
 * Singleton instance of PayingService
 */
export const payingService = new PayingService();
