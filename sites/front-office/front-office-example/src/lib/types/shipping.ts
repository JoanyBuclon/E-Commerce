/**
 * Shipping status enum
 */
export enum ShippingStatus {
	PREPARING = 'PREPARING',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED',
	RETURNED = 'RETURNED'
}

/**
 * Address model for shipment delivery
 */
export interface Address {
	street: string;
	city: string;
	zip: string;
}

/**
 * Request model for creating a new shipment
 */
export interface CreateShipmentRequest {
	orderId: string; // UUID
	address: Address;
}

/**
 * Request model for updating shipment status
 */
export interface UpdateShipmentStatusRequest {
	status: ShippingStatus;
}

/**
 * Shipment response model
 */
export interface Shipment {
	id: string; // UUID
	orderId: string; // UUID
	address: Address;
	status: ShippingStatus;
	createdAt?: string; // ISO date-time
}

/**
 * Custom error for shipping service operations
 */
export class ShippingError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public originalError?: unknown
	) {
		super(message);
		this.name = 'ShippingError';
	}
}

/**
 * Type guard to check if error is a ShippingError
 */
export function isShippingError(error: unknown): error is ShippingError {
	return error instanceof ShippingError;
}
