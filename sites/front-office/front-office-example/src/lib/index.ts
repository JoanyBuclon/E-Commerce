// place files you want to import through the `$lib` alias in this folder.

// Cataloging Service
export { catalogingService } from './services/cataloging.service';
export type {
	Product,
	ProductListParams,
	ProductListResponse,
	ProductDetailResponse
} from './types/cataloging';
export { CatalogingError, isCatalogingError } from './types/cataloging';

// Profiling Service
export { profilingService } from './services/profiling.service';
export type { User, CreateUserRequest, LoginRequest, LoginResponse } from './types/profiling';
export { ProfilingError, isProfilingError } from './types/profiling';

// Ordering Service
export { orderingService } from './services/ordering.service';
export type {
	Order,
	OrderItem,
	CreateOrderRequest,
	ListOrdersParams,
	OrderListResponse,
	OrderDetailResponse,
	UpdateOrderStatusRequest
} from './types/ordering';
export { OrderStatus, OrderingError, isOrderingError } from './types/ordering';

// Auth Store
export { authStore } from './stores/auth.svelte';

// Cart Store
export { cartStore } from './stores/cart.svelte';

// Cart Types
export type { CartItem, CartSummary } from './types/cart';

// Storage Utilities
export { tokenStorage } from './utils/storage';

// Paying Service
export { payingService } from './services/paying.service';
export type { ProcessPaymentRequest, Payment } from './types/paying';
export { PayingError, isPayingError } from './types/paying';

// Shipping Service
export { shippingService } from './services/shipping.service';
export type {
	Shipment,
	Address,
	CreateShipmentRequest,
	UpdateShipmentStatusRequest
} from './types/shipping';
export { ShippingStatus, ShippingError, isShippingError } from './types/shipping';
