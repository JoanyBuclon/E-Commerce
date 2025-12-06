import { browser } from '$app/environment';

/**
 * Environment configuration for the back-office application
 * Vite exposes env vars prefixed with VITE_ to the client
 */

/**
 * Get environment variable value
 * @param key - Environment variable key (without VITE_ prefix)
 * @param defaultValue - Default value if not set
 */
function getEnv(key: string, defaultValue: string = ''): string {
	// In browser, use import.meta.env
	// In server (SSR), import.meta.env is also available
	const value = import.meta.env[`VITE_${key}`];
	return value !== undefined ? String(value) : defaultValue;
}

/**
 * Parse boolean environment variable
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
	const value = getEnv(key);
	if (!value) return defaultValue;

	return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Configuration object
 */
export const config = {
	/**
	 * Base API URL for backend services (via Traefik)
	 */
	apiBaseUrl: getEnv('API_BASE_URL', 'http://localhost/api'),

	/**
	 * Whether to use fake/mock data for cataloging service
	 */
	fakeCataloging: getEnvBoolean('FAKE_CATALOGING', false),

	/**
	 * Whether to use fake/mock data for ordering service
	 */
	fakeOrdering: getEnvBoolean('FAKE_ORDERING', false),

	/**
	 * Whether to use fake/mock data for shipping service
	 */
	fakeShipping: getEnvBoolean('FAKE_SHIPPING', false),

	/**
	 * Whether the app is running in the browser
	 */
	isBrowser: browser
} as const;

/**
 * Cataloging service configuration
 */
export const catalogingConfig = {
	baseUrl: getEnv('CATALOGING_URL') || `${config.apiBaseUrl}/cataloging`,
	useFakeData: config.fakeCataloging
} as const;

/**
 * Ordering service configuration
 */
export const orderingConfig = {
	baseUrl: getEnv('ORDERING_URL') || `${config.apiBaseUrl}/ordering`,
	useFakeData: config.fakeOrdering
} as const;

/**
 * Shipping service configuration
 */
export const shippingConfig = {
	baseUrl: getEnv('SHIPPING_URL') || `${config.apiBaseUrl}/shipping`,
	useFakeData: config.fakeShipping
} as const;
