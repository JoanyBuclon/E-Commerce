import { tokenStorage } from '$lib/utils/storage';
import type { User } from '$lib/types/user';

/**
 * Authentication Store for Back-Office Admin
 * Manages global authentication state using Svelte 5 runes
 * Provides reactive state for current admin user and authentication status
 *
 * NOTE: Login implementation is currently hardcoded for development
 * TODO: Implement proper admin authentication (via PROFILING service or dedicated admin endpoint)
 */
class AuthStore {
	currentUser = $state<User | null>(null);
	isAuthenticated = $derived(this.currentUser !== null);
	isLoading = $state(false);
	error = $state<string | null>(null);

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
	 * Login with admin email and password
	 * Stores token and sets current user on success
	 *
	 * TEMPORARY IMPLEMENTATION:
	 * Currently uses hardcoded admin credentials for development
	 *
	 * TODO: Replace with one of:
	 * - Option 1: Call PROFILING service with role=ADMIN verification
	 * - Option 2: Create dedicated /admin/login endpoint
	 * - Option 3: Integrate with external IAM system
	 *
	 * @param email - Admin email
	 * @param password - Admin password
	 */
	async login(email: string, password: string): Promise<void> {
		this.isLoading = true;
		this.error = null;

		try {
			// TODO: Implement real admin authentication
			// For now: hardcoded admin credentials
			if (email === 'admin@example.com' && password === 'admin123') {
				const adminUser: User = {
					id: 'admin-001',
					email: 'admin@example.com',
					firstName: 'Admin',
					lastName: 'User'
				};
				const token = 'fake-admin-token-123';

				this.setAuth(adminUser, token);
			} else {
				throw new Error('Invalid admin credentials');
			}
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Login failed';
			throw err;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Set authentication data
	 * Helper method used by login
	 */
	private setAuth(user: User, token: string): void {
		// Store token
		tokenStorage.setToken(token);

		// Store user
		tokenStorage.setUser(user);
		this.currentUser = user;

		// Clear any errors
		this.error = null;
	}

	/**
	 * Logout current admin user
	 * Clears token and user data
	 */
	async logout(): Promise<void> {
		this.isLoading = true;

		try {
			// Clear storage
			tokenStorage.clear();

			// Clear state
			this.currentUser = null;
			this.error = null;
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
