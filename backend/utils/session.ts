/**
 * Simple in-memory session store for current active session
 * Supports stateless JWT tokens with stateful fallback for frictionless browser client sync
 */
let activeUserId: string = ''; // Starts empty so first-time visitors see 'Sign In' & 'Join Now'

export const sessionStore = {
  getUserId: (): string => activeUserId,
  setUserId: (id: string): void => {
    activeUserId = id;
  },
  clear: (): void => {
    activeUserId = '';
  },
};
