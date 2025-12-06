/**
 * User entity representing an authenticated user profile
 */
export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

/**
 * Request body for user registration
 */
export interface CreateUserRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

/**
 * Request body for user login
 */
export interface LoginRequest {
	email: string;
	password: string;
}

/**
 * Response from POST /login
 */
export interface LoginResponse {
	user: User;
	token?: string;
}

/**
 * Custom error for profiling service operations
 */
export class ProfilingError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public originalError?: unknown
	) {
		super(message);
		this.name = 'ProfilingError';
	}
}

/**
 * Type guard to check if error is a ProfilingError
 */
export function isProfilingError(error: unknown): error is ProfilingError {
	return error instanceof ProfilingError;
}
