import { profilingConfig } from '$lib/config/env';
import type {
	User,
	CreateUserRequest,
	LoginRequest,
	LoginResponse
} from '$lib/types/profiling';
import { ProfilingError } from '$lib/types/profiling';
import {
	mockUsers,
	findMockUserByEmail,
	validateMockCredentials,
	findMockUserById,
	createMockUser,
	simulateDelay
} from '$lib/mocks/users';

/**
 * Profiling Service
 * Provides methods to interact with the profiling API
 * Automatically switches between real API and mock data based on configuration
 */
class ProfilingService {
	private readonly baseUrl: string;
	private readonly useFakeData: boolean;

	constructor() {
		this.baseUrl = profilingConfig.baseUrl;
		this.useFakeData = profilingConfig.useFakeData;
	}

	/**
	 * Register a new user
	 * @param data - User registration data
	 * @returns Promise with created user
	 */
	async register(data: CreateUserRequest): Promise<User> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.registerFake(data);
		}

		try {
			const response = await fetch(`${this.baseUrl}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				if (response.status === 409) {
					throw new ProfilingError('Email already exists', 409);
				}

				throw new ProfilingError(
					`Failed to register user: ${response.statusText}`,
					response.status
				);
			}

			// API returns 201 Created, but may not return the user object
			// Try to parse response body, or create user object from request data
			try {
				const user = await response.json();
				return user;
			} catch {
				// If no response body, we need to get the user ID somehow
				// For now, return a temporary user object
				// In real implementation, the API should return the created user
				throw new ProfilingError('Registration successful but user data not returned', 201);
			}
		} catch (error) {
			if (error instanceof ProfilingError) {
				throw error;
			}

			throw new ProfilingError('Failed to register user', undefined, error);
		}
	}

	/**
	 * Authenticate user with email and password
	 * @param credentials - Login credentials
	 * @returns Promise with user and token
	 */
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.loginFake(credentials);
		}

		try {
			const response = await fetch(`${this.baseUrl}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(credentials)
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new ProfilingError('Invalid email or password', 401);
				}

				throw new ProfilingError(`Login failed: ${response.statusText}`, response.status);
			}

			const user = await response.json();

			// Extract JWT token from Authorization header or response body
			let token: string | undefined;

			// Try Authorization header first
			const authHeader = response.headers.get('Authorization');
			if (authHeader) {
				// Remove 'Bearer ' prefix if present
				token = authHeader.replace(/^Bearer\s+/i, '');
			}

			// Fallback to response body
			if (!token && user.token) {
				token = user.token;
			}

			return { user, token };
		} catch (error) {
			if (error instanceof ProfilingError) {
				throw error;
			}

			throw new ProfilingError('Login failed', undefined, error);
		}
	}

	/**
	 * Get user profile by ID
	 * @param id - User ID (UUID)
	 * @returns Promise with user details
	 */
	async getUserById(id: string): Promise<User> {
		// Use mock data if fake mode is enabled
		if (this.useFakeData) {
			return this.getUserByIdFake(id);
		}

		try {
			const url = `${this.baseUrl}/users/${encodeURIComponent(id)}`;

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new ProfilingError(`User with ID ${id} not found`, 404);
				}

				if (response.status === 403) {
					throw new ProfilingError('Access denied', 403);
				}

				throw new ProfilingError(
					`Failed to fetch user: ${response.statusText}`,
					response.status
				);
			}

			const user = await response.json();
			return user;
		} catch (error) {
			if (error instanceof ProfilingError) {
				throw error;
			}

			throw new ProfilingError(`Failed to fetch user ${id}`, undefined, error);
		}
	}

	/**
	 * FAKE MODE: Register user using mock data
	 */
	private async registerFake(data: CreateUserRequest): Promise<User> {
		// Simulate network delay
		await simulateDelay(500);

		// Check if email already exists
		const existingUser = findMockUserByEmail(data.email);
		if (existingUser) {
			throw new ProfilingError('Email already exists', 409);
		}

		// Create new mock user
		const newUser = createMockUser(data);
		return newUser;
	}

	/**
	 * FAKE MODE: Login using mock data
	 */
	private async loginFake(credentials: LoginRequest): Promise<LoginResponse> {
		// Simulate network delay
		await simulateDelay(400);

		// Validate credentials
		if (!validateMockCredentials(credentials.email, credentials.password)) {
			throw new ProfilingError('Invalid email or password', 401);
		}

		// Find user
		const user = findMockUserByEmail(credentials.email);
		if (!user) {
			throw new ProfilingError('Invalid email or password', 401);
		}

		// Generate mock JWT token
		const token = `mock-jwt-token-${user.id}-${Date.now()}`;

		return { user, token };
	}

	/**
	 * FAKE MODE: Get user by ID using mock data
	 */
	private async getUserByIdFake(id: string): Promise<User> {
		// Simulate network delay
		await simulateDelay(200);

		const user = findMockUserById(id);

		if (!user) {
			throw new ProfilingError(`User with ID ${id} not found`, 404);
		}

		return user;
	}
}

/**
 * Singleton instance of the profiling service
 * Import and use this in your components
 */
export const profilingService = new ProfilingService();

/**
 * Export the class for testing purposes
 */
export { ProfilingService };
