import apiClient from './client';
import type { ApiResponse, LoginPayload, RegisterPayload, User } from './types';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerUser = (payload: RegisterPayload) =>
  apiClient.post<ApiResponse<{ user: User }>>('/auth/register', payload);

export const loginUser = (payload: LoginPayload) =>
  apiClient.post<ApiResponse<{ accessToken: string; user: User }>>('/auth/login', payload);

export const logoutUser = () =>
  apiClient.post<ApiResponse>('/auth/logout');
