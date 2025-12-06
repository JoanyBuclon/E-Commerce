// Services
export { catalogingService } from './services/cataloging.service';
export { orderingService } from './services/ordering.service';
export { shippingService } from './services/shipping.service';

// Types - Cataloging
export type {
	Product,
	ProductListParams,
	ProductListResponse,
	ProductDetailResponse,
	CreateProductRequest,
	CreateProductResponse
} from './types/cataloging';
export { CatalogingError, isCatalogingError } from './types/cataloging';

// Types - Ordering
export type {
	OrderItem,
	Order,
	CreateOrderRequest,
	ListOrdersParams,
	OrderListResponse,
	OrderDetailResponse,
	UpdateOrderStatusRequest
} from './types/ordering';
export { OrderStatus, OrderingError, isOrderingError } from './types/ordering';

// Types - Shipping
export type {
	Address,
	Shipment,
	CreateShipmentRequest,
	UpdateShipmentStatusRequest
} from './types/shipping';
export { ShippingStatus, ShippingError, isShippingError } from './types/shipping';

// Types - User
export type { User } from './types/user';

// Stores
export { authStore } from './stores/auth.svelte';

// Utils
export { tokenStorage } from './utils/storage';
