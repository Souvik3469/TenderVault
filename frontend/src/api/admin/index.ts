import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import type { ApiResponse, AdminStats, PaginatedTenders } from '../types';

// ─── Query key factory ────────────────────────────────────────────────────────
export const adminKeys = {
  stats:   () => ['admin-stats'] as const,
  tenders: (params: object) => ['admin-tenders', params] as const,
};

// ─── Raw async functions ──────────────────────────────────────────────────────

export const getAdminStats = async (): Promise<ApiResponse<AdminStats>> => {
  const { data } = await apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
  return data;
};

export const getAllTendersAdmin = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}): Promise<ApiResponse<PaginatedTenders>> => {
  const { data } = await apiClient.get<ApiResponse<PaginatedTenders>>('/admin/tenders', {
    params,
  });
  return data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

export const useAdminStats = () =>
  useQuery({
    queryKey: adminKeys.stats(),
    queryFn: getAdminStats,
    select: (res) => res.data,
  });

export const useAdminTenders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}) =>
  useQuery({
    queryKey: adminKeys.tenders(params ?? {}),
    queryFn: () => getAllTendersAdmin(params),
    select: (res) => res.data,
  });
