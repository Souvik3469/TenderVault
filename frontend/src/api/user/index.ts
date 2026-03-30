import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type {
  ApiResponse,
  User,
  Bid,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '../types';

// ─── Raw async functions ──────────────────────────────────────────────────────

export const GetMyDetails = async (): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.get<ApiResponse<User>>('/users/me');
  return data;
};

export const GetUserDetails = async (userId: string): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
  return data;
};

export const GetVendors = async (): Promise<ApiResponse<User[]>> => {
  const { data } = await apiClient.get<ApiResponse<User[]>>('/users/vendors');
  return data;
};

export const GetCompanies = async (): Promise<ApiResponse<User[]>> => {
  const { data } = await apiClient.get<ApiResponse<User[]>>('/users/companies');
  return data;
};

export const GetMyBids = async (): Promise<ApiResponse<Bid[]>> => {
  const { data } = await apiClient.get<ApiResponse<Bid[]>>('/users/me/bids');
  return data;
};

export const updateProfile = async (payload: UpdateProfilePayload): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.put<ApiResponse<User>>('/users/me', payload);
  return data;
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<ApiResponse> => {
  const { data } = await apiClient.put<ApiResponse>('/users/me/password', payload);
  return data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

/** Current authenticated user */
export const GetMyDetailsQuery = () =>
  useQuery({
    queryKey: ['my-details'],
    queryFn: GetMyDetails,
    select: (res) => res.data,
  });

/** Any user by ID */
export const GetUserQuery = (userId: string) =>
  useQuery({
    queryKey: ['user-details', userId],
    queryFn: () => GetUserDetails(userId),
    select: (res) => res.data,
    enabled: !!userId,
  });

/** List of vendors */
export const GetVendorQuery = () =>
  useQuery({
    queryKey: ['vendors'],
    queryFn: GetVendors,
    select: (res) => res.data,
  });

/** List of companies */
export const GetCompanyQuery = () =>
  useQuery({
    queryKey: ['companies'],
    queryFn: GetCompanies,
    select: (res) => res.data,
  });

/** Vendor's own bids */
export const useMyBids = () =>
  useQuery({
    queryKey: ['my-bids'],
    queryFn: GetMyBids,
    select: (res) => res.data,
  });

/** Update own profile */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-details'] });
    },
  });
};

/** Change own password */
export const useChangePassword = () =>
  useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
