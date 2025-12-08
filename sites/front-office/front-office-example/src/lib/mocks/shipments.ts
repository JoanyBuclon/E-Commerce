import type { Shipment, CreateShipmentRequest, UpdateShipmentStatusRequest } from '$lib/types/shipping';
import { ShippingStatus } from '$lib/types/shipping';

/**
 * Mock shipment data for development/testing
 * Used when VITE_FAKE_SHIPPING environment variable is set to 'true'
 */
export const mockShipments: Shipment[] = [
	{
		id: 'shipment-uuid-001',
		orderId: 'order-uuid-001',
		address: {
			street: '123 Rue de la Paix',
			city: 'Paris',
			zip: '75001'
		},
		status: ShippingStatus.DELIVERED,
		createdAt: '2025-01-01T12:00:00Z'
	},
	{
		id: 'shipment-uuid-002',
		orderId: 'order-uuid-002',
		address: {
			street: '456 Avenue des Champs',
			city: 'Lyon',
			zip: '69001'
		},
		status: ShippingStatus.SHIPPED,
		createdAt: '2025-01-05T15:00:00Z'
	},
	{
		id: 'shipment-uuid-003',
		orderId: 'order-uuid-003',
		address: {
			street: '789 Boulevard de la Mer',
			city: 'Marseille',
			zip: '13001'
		},
		status: ShippingStatus.PREPARING,
		createdAt: '2025-01-10T10:00:00Z'
	}
];

/**
 * Counter for generating mock shipment IDs
 */
let shipmentIdCounter = mockShipments.length + 1;

/**
 * Re-export the delay function from products for consistency
 */
export { simulateDelay } from './products';

/**
 * Find shipment by ID
 */
export function findMockShipmentById(id: string): Shipment | undefined {
	return mockShipments.find((shipment) => shipment.id === id);
}

/**
 * Find shipment by order ID
 */
export function findMockShipmentByOrderId(orderId: string): Shipment | undefined {
	return mockShipments.find((shipment) => shipment.orderId === orderId);
}

/**
 * Create a new mock shipment
 * Always starts in PREPARING status
 */
export function createMockShipment(data: CreateShipmentRequest): Shipment {
	const newShipment: Shipment = {
		id: `shipment-uuid-${String(shipmentIdCounter).padStart(3, '0')}`,
		orderId: data.orderId,
		address: data.address,
		status: ShippingStatus.PREPARING,
		createdAt: new Date().toISOString()
	};

	shipmentIdCounter++;

	// Add shipment to mock array
	mockShipments.push(newShipment);

	return newShipment;
}

/**
 * Update mock shipment status
 */
export function updateMockShipmentStatus(
	id: string,
	data: UpdateShipmentStatusRequest
): Shipment | undefined {
	const shipment = findMockShipmentById(id);

	if (!shipment) {
		return undefined;
	}

	// Update the status
	shipment.status = data.status;

	return shipment;
}
