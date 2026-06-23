import { apiClient, withMockFallback } from '../lib/apiClient';
import { mockUser } from '../lib/mockData';
import type { UpdateProfilePayload, User } from '../types/user';

export const userApi = {
  async getCurrentUser(): Promise<User> {
    return withMockFallback(apiClient.get<User>('/users/me'), mockUser);
  },
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    return withMockFallback(apiClient.put<User>('/users/me', payload), { ...mockUser, ...payload });
  }
};
