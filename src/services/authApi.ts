import { apiClient, API_BASE_URL, BACKEND_UNAVAILABLE_MESSAGE, TOKEN_KEY } from '../lib/apiClient';
import type { AuthResponse, LoginCredentials, RegisterPayload } from '../types/auth';
import type { User } from '../types/user';

const MOCK_USER_KEY = 'landed.mockUser';
const MOCK_AUTH_USERS_KEY = 'landed.mockAuthUsers';
const GOOGLE_SCRIPT_ID = 'google-identity-services';

type StoredMockUser = User & {
  password: string;
};

const isLocalhostOrigin = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const isLocalAuthFallbackEnabled = () =>
  import.meta.env.DEV ||
  isLocalhostOrigin() ||
  API_BASE_URL.includes('localhost') ||
  API_BASE_URL.includes('127.0.0.1');

const shouldUseLocalAuthFallback = (error: unknown) =>
  isLocalAuthFallbackEnabled() &&
  error instanceof Error &&
  (error.message === 'Network Error' ||
    error.message.includes('timeout') ||
    error.message.includes('Could not reach the sign-in server') ||
    error.message === BACKEND_UNAVAILABLE_MESSAGE);

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

type GoogleConfigResponse = {
  clientId?: string;
};

let cachedGoogleClientId: string | null = null;

const getGoogleClientId = async () => {
  const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  if (envClientId?.trim()) {
    return envClientId.trim();
  }

  if (cachedGoogleClientId) {
    return cachedGoogleClientId;
  }

  const response = await apiClient.get<GoogleConfigResponse>('/auth/google/config');
  const serverClientId = response.data.clientId?.trim();

  if (serverClientId) {
    cachedGoogleClientId = serverClientId;
    return serverClientId;
  }

  throw new Error('Google sign-in is not configured on the server.');
};

type GoogleCredentialResponse = {
  credential?: string;
};

type GooglePromptMomentNotification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
};

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  prompt: (momentListener?: (notification: GooglePromptMomentNotification) => void) => void;
  cancel: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

const loadGoogleIdentityServices = () =>
  new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Could not load Google sign-in.')), {
        once: true
      });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Google sign-in.'));
    document.head.appendChild(script);
  });

const requestGoogleCredential = async () => {
  const clientId = await getGoogleClientId();

  await loadGoogleIdentityServices();

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const fail = (message: string) => {
      if (!settled) {
        settled = true;
        window.google?.accounts?.id?.cancel();
        reject(new Error(message));
      }
    };

    window.google?.accounts?.id?.initialize({
      client_id: clientId,
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: (response) => {
        if (response.credential) {
          settled = true;
          resolve(response.credential);
          return;
        }

        fail('Google did not return a sign-in credential.');
      }
    });

    window.google?.accounts?.id?.prompt((notification) => {
      if (notification?.isNotDisplayed() || notification?.isSkippedMoment()) {
        fail('Google sign-in was cancelled or could not be shown.');
      }
    });
  });
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
  async signInWithGoogle(): Promise<AuthResponse> {
    const credential = await requestGoogleCredential();
    const response = await apiClient.post<AuthResponse>('/auth/google', { credential });
    return response.data;
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
