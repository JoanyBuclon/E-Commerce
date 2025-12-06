import { browser } from '$app/environment';
import type { User } from '$lib/types/user';

/**
 * Storage keys for localStorage
 */
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

/**
 * Type-safe localStorage wrapper for authentication data
 * Handles SSR-safe access and error handling
 */
export const tokenStorage = {
	/**
	 * Get authentication token from localStorage
	 */
	getToken(): string | null {
		if (!browser) return null;

		try {
			return localStorage.getItem(TOKEN_KEY);
		} catch (error) {
			console.error('Failed to get token from localStorage:', error);
			return null;
		}
	},

	/**
	 * Store authentication token in localStorage
	 */
	setToken(token: string): void {
		if (!browser) return;

		try {
			localStorage.setItem(TOKEN_KEY, token);
		} catch (error) {
			console.error('Failed to store token in localStorage:', error);
		}
	},

	/**
	 * Remove authentication token from localStorage
	 */
	removeToken(): void {
		if (!browser) return;

		try {
			localStorage.removeItem(TOKEN_KEY);
		} catch (error) {
			console.error('Failed to remove token from localStorage:', error);
		}
	},

	/**
	 * Get cached user object from localStorage
	 */
	getUser(): User | null {
		if (!browser) return null;

		try {
			const userJson = localStorage.getItem(USER_KEY);
			if (!userJson) return null;

			return JSON.parse(userJson) as User;
		} catch (error) {
			console.error('Failed to get user from localStorage:', error);
			return null;
		}
	},

	/**
	 * Store user object in localStorage
	 */
	setUser(user: User): void {
		if (!browser) return;

		try {
			localStorage.setItem(USER_KEY, JSON.stringify(user));
		} catch (error) {
			console.error('Failed to store user in localStorage:', error);
		}
	},

	/**
	 * Remove user object from localStorage
	 */
	removeUser(): void {
		if (!browser) return;

		try {
			localStorage.removeItem(USER_KEY);
		} catch (error) {
			console.error('Failed to remove user from localStorage:', error);
		}
	},

	/**
	 * Clear all authentication data from localStorage
	 */
	clear(): void {
		this.removeToken();
		this.removeUser();
	}
};
