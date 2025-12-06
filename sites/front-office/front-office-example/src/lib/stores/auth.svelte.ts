import { profilingService } from '$lib/services/profiling.service';
import { tokenStorage } from '$lib/utils/storage';
import type { User, LoginRequest, CreateUserRequest } from '$lib/types/profiling';

/**
 * Authentication Store
 * Manages global authentication state using Svelte 5 runes
 * Provides reactive state for current user and authentication status
 */
class AuthStore {
	currentUser = $state<User | null>(null);
	isAuthenticated = $derived(this.currentUser !== null);
	isLoading = $state(false);

	/**
	 * Initialize auth store by checking for existing token
	 * Call this on app startup (in root layout)
	 */
	async initialize(): Promise<void> {
		const token = tokenStorage.getToken();
		const cachedUser = tokenStorage.getUser();

		// No token, no auth
		if (!token) {
			this.currentUser = null;
			return;
		}

		// Use cached user if available (fast hydration)
		if (cachedUser) {
			this.currentUser = cachedUser;
		}

		// Optionally validate token by fetching user profile
		// For now, we trust the cached user if token exists
		// In production, you might want to verify with an API call
	}

	/**
	 * Login with email and password
	 * Stores token and sets current user on success
	 * @param credentials - Login credentials
	 */
	async login(credentials: LoginRequest): Promise<void> {
		this.isLoading = true;

		try {
			const response = await profilingService.login(credentials);

			// Store token if provided
			if (response.token) {
				tokenStorage.setToken(response.token);
			}

			// Store user
			tokenStorage.setUser(response.user);
			this.currentUser = response.user;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Register new user
	 * Automatically logs in after successful registration
	 * @param data - Registration data
	 */
	async register(data: CreateUserRequest): Promise<void> {
		this.isLoading = true;

		try {
			// Register user
			const user = await profilingService.register(data);

			// Auto-login after registration
			await this.login({
				email: data.email,
				password: data.password
			});
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Logout current user
	 * Clears token and user data
	 */
	async logout(): Promise<void> {
		this.isLoading = true;

		try {
			// Clear storage
			tokenStorage.clear();

			// Clear state
			this.currentUser = null;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Refresh current user data from server
	 * Useful after profile updates
	 */
	async refreshUser(): Promise<void> {
		if (!this.currentUser) {
			return;
		}

		this.isLoading = true;

		try {
			const user = await profilingService.getUserById(this.currentUser.id);
			this.currentUser = user;
			tokenStorage.setUser(user);
		} finally {
			this.isLoading = false;
		}
	}
}

/**
 * Singleton instance of the auth store
 * Import and use this in your components
 */
export const authStore = new AuthStore();
