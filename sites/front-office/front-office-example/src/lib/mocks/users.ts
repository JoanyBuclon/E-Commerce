import type { User, CreateUserRequest } from '$lib/types/profiling';

/**
 * Mock user data for development/testing
 * Used when VITE_FAKE_PROFILING environment variable is set to 'true'
 */
export const mockUsers: User[] = [
	{
		id: 'user-uuid-001',
		email: 'john.doe@example.com',
		firstName: 'John',
		lastName: 'Doe'
	},
	{
		id: 'user-uuid-002',
		email: 'jane.smith@example.com',
		firstName: 'Jane',
		lastName: 'Smith'
	},
	{
		id: 'user-uuid-003',
		email: 'bob.wilson@example.com',
		firstName: 'Bob',
		lastName: 'Wilson'
	},
	{
		id: 'user-uuid-004',
		email: 'alice.brown@example.com',
		firstName: 'Alice',
		lastName: 'Brown'
	}
];

/**
 * Mock credentials storage (email -> password mapping)
 * In real implementation, passwords would be hashed
 */
const mockCredentials = new Map<string, string>([
	['john.doe@example.com', 'password123'],
	['jane.smith@example.com', 'password456'],
	['bob.wilson@example.com', 'test1234'],
	['alice.brown@example.com', 'secure789']
]);

/**
 * Counter for generating mock user IDs
 */
let userIdCounter = mockUsers.length + 1;

/**
 * Re-export the delay function from products for consistency
 */
export { simulateDelay } from './products';

/**
 * Find user by email
 */
export function findMockUserByEmail(email: string): User | undefined {
	return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Validate user credentials
 */
export function validateMockCredentials(email: string, password: string): boolean {
	const storedPassword = mockCredentials.get(email.toLowerCase());
	return storedPassword !== undefined && storedPassword === password;
}

/**
 * Find user by ID
 */
export function findMockUserById(id: string): User | undefined {
	return mockUsers.find((user) => user.id === id);
}

/**
 * Create a new mock user
 * Generates a unique ID and adds to mock users array
 */
export function createMockUser(data: CreateUserRequest): User {
	const newUser: User = {
		id: `user-uuid-${String(userIdCounter).padStart(3, '0')}`,
		email: data.email,
		firstName: data.firstName,
		lastName: data.lastName
	};

	userIdCounter++;

	// Add user to mock array
	mockUsers.push(newUser);

	// Add credentials to map
	mockCredentials.set(data.email.toLowerCase(), data.password);

	return newUser;
}
