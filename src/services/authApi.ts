import { apiClient, API_BASE_URL, TOKEN_KEY } from '../lib/apiClient';
import type { AuthResponse, LoginCredentials, RegisterPayload } from '../types/auth';
import type { User } from '../types/user';

const MOCK_USER_KEY = 'landed.mockUser';
const MOCK_AUTH_USERS_KEY = 'landed.mockAuthUsers';

type StoredMockUser = User & {
  password: string;
};

const isLocalAuthFallbackEnabled = () =>
  import.meta.env.DEV || API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');

const shouldUseLocalAuthFallback = (error: unknown) =>
  isLocalAuthFallbackEnabled() &&
  error instanceof Error &&
  (error.message === 'Network Error' || error.message.includes('timeout'));

const createMockAuthResponse = (user: User): AuthResponse => {
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));

  return {
    token: 'landed.mock.' + user.id,
    tokenType: 'Bearer',
    expiresIn: 86_400,
    user
  };
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const makeMockUserId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return 'local-user-' + crypto.randomUUID();
  }

  return 'local-user-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

const readStoredMockUsers = (): StoredMockUser[] => {
  const stored = localStorage.getItem(MOCK_AUTH_USERS_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as StoredMockUser[];
  } catch {
    localStorage.removeItem(MOCK_AUTH_USERS_KEY);
    return [];
  }
};

const writeStoredMockUsers = (users: StoredMockUser[]) => {
  localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(users));
};

const toPublicMockUser = (user: StoredMockUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});

const getStoredMockUser = (): User | null => {
  const stored = localStorage.getItem(MOCK_USER_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem(MOCK_USER_KEY);
    return null;
  }
};

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (!shouldUseLocalAuthFallback(error)) {
        throw error;
      }

      const email = normalizeEmail(credentials.email);
      const user = readStoredMockUsers().find((storedUser) => storedUser.email === email);

      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid email or password');
      }

      return createMockAuthResponse(toPublicMockUser(user));
    }
  },
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', payload);
      return response.data;
    } catch (error) {
      if (!shouldUseLocalAuthFallback(error)) {
        throw error;
      }

      const email = normalizeEmail(payload.email);
      const users = readStoredMockUsers();

      if (users.some((user) => user.email === email)) {
        throw new Error('An account with this email already exists');
      }

      const user: StoredMockUser = {
        id: makeMockUserId(),
        name: payload.name,
        email,
        role: 'Job seeker',
        password: payload.password
      };

      writeStoredMockUsers([...users, user]);

      return createMockAuthResponse(toPublicMockUser(user));
    }
  },
  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem(TOKEN_KEY);
    const mockUser = token?.startsWith('landed.mock.') ? getStoredMockUser() : null;

    if (mockUser) {
      return mockUser;
    }

    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },
  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MOCK_USER_KEY);
  }
};
