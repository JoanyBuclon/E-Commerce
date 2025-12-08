import { shippingConfig } from '$lib/config/env';
import type {
	Shipment,
	CreateShipmentRequest,
	UpdateShipmentStatusRequest
} from '$lib/types/shipping';
import { ShippingError } from '$lib/types/shipping';
import {
	createMockShipment,
	findMockShipmentById,
	updateMockShipmentStatus,
	simulateDelay
} from '$lib/mocks/shipments';

/**
 * Shipping service for managing shipments
 * Supports both real API calls and mock data mode
 * Adapted for back-office: browser checks removed to allow SSR
 */
class ShippingService {
	private readonly baseUrl: string;
	private readonly useFakeData: boolean;

	constructor() {
		this.baseUrl = shippingConfig.baseUrl;
		this.useFakeData = shippingConfig.useFakeData;
	}

	/**
	 * Create a new shipment for an order
	 * Starts in PREPARING status
	 */
	async createShipment(data: CreateShipmentRequest): Promise<Shipment> {
		if (this.useFakeData) {
			return this.createShipmentFake(data);
		}

		return this.createShipmentReal(data);
	}

	/**
	 * Update shipment status
	 */
	async updateShipmentStatus(
		id: string,
		data: UpdateShipmentStatusRequest
	): Promise<Shipment> {
		if (this.useFakeData) {
			return this.updateShipmentStatusFake(id, data);
		}

		return this.updateShipmentStatusReal(id, data);
	}

	/**
	 * Get shipment by ID
	 */
	async getShipmentById(id: string): Promise<Shipment> {
		if (this.useFakeData) {
			return this.getShipmentByIdFake(id);
		}

		return this.getShipmentByIdReal(id);
	}

	/**
	 * Create shipment using mock data
	 */
	private async createShipmentFake(data: CreateShipmentRequest): Promise<Shipment> {
		// Simulate network delay
		await simulateDelay(400);

		// Create and return mock shipment
		return createMockShipment(data);
	}

	/**
	 * Create shipment using real API
	 */
	private async createShipmentReal(data: CreateShipmentRequest): Promise<Shipment> {
		try {
			const response = await fetch(`${this.baseUrl}/shipments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new ShippingError(
					`Failed to create shipment: ${response.statusText}`,
					response.status
				);
			}

			const shipment: Shipment = await response.json();
			return shipment;
		} catch (err) {
			if (err instanceof ShippingError) {
				throw err;
			}

			throw new ShippingError('Failed to create shipment', undefined, err);
		}
	}

	/**
	 * Update shipment status using mock data
	 */
	private async updateShipmentStatusFake(
		id: string,
		data: UpdateShipmentStatusRequest
	): Promise<Shipment> {
		// Simulate network delay
		await simulateDelay(300);

		// Update mock shipment
		const shipment = updateMockShipmentStatus(id, data);

		if (!shipment) {
			throw new ShippingError(`Shipment not found: ${id}`, 404);
		}

		return shipment;
	}

	/**
	 * Update shipment status using real API
	 */
	private async updateShipmentStatusReal(
		id: string,
		data: UpdateShipmentStatusRequest
	): Promise<Shipment> {
		try {
			const response = await fetch(`${this.baseUrl}/shipments/${id}/status`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new ShippingError(
					`Failed to update shipment status: ${response.statusText}`,
					response.status
				);
			}

			const shipment: Shipment = await response.json();
			return shipment;
		} catch (err) {
			if (err instanceof ShippingError) {
				throw err;
			}

			throw new ShippingError('Failed to update shipment status', undefined, err);
		}
	}

	/**
	 * Get shipment by ID using mock data
	 */
	private async getShipmentByIdFake(id: string): Promise<Shipment> {
		// Simulate network delay
		await simulateDelay(200);

		// Find mock shipment
		const shipment = findMockShipmentById(id);

		if (!shipment) {
			throw new ShippingError(`Shipment not found: ${id}`, 404);
		}

		return shipment;
	}

	/**
	 * Get shipment by ID using real API
	 */
	private async getShipmentByIdReal(id: string): Promise<Shipment> {
		try {
			const response = await fetch(`${this.baseUrl}/shipments/${id}`);

			if (!response.ok) {
				const errorText = await response.text();
				throw new ShippingError(
					`Failed to get shipment: ${response.statusText}`,
					response.status
				);
			}

			const shipment: Shipment = await response.json();
			return shipment;
		} catch (err) {
			if (err instanceof ShippingError) {
				throw err;
			}

			throw new ShippingError('Failed to get shipment', undefined, err);
		}
	}
}

/**
 * Singleton instance of ShippingService
 */
export const shippingService = new ShippingService();
