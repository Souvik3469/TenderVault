import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type { ApiResponse, Notification } from '../types';

// ─── Query key factory ────────────────────────────────────────────────────────
export const notificationKeys = {
  all:         () => ['notifications'] as const,
  unreadCount: () => ['notifications-unread-count'] as const,
};

// ─── Raw async functions ──────────────────────────────────────────────────────

export const getMyNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  const { data } = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
  return data;
};

export const getUnreadCount = async (): Promise<ApiResponse<{ count: number }>> => {
  const { data } = await apiClient.get<ApiResponse<{ count: number }>>(
    '/notifications/unread-count'
  );
  return data;
};

export const markRead = async (notificationId: string): Promise<ApiResponse<Notification>> => {
  const { data } = await apiClient.patch<ApiResponse<Notification>>(
    `/notifications/${notificationId}/read`
  );
  return data;
};

export const markAllRead = async (): Promise<ApiResponse> => {
  const { data } = await apiClient.patch<ApiResponse>('/notifications/read-all');
  return data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

export const useNotifications = () =>
  useQuery({
    queryKey: notificationKeys.all(),
    queryFn: getMyNotifications,
    select: (res) => res.data ?? [],
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadCount,
    select: (res) => res.data?.count ?? 0,
    refetchInterval: 30_000, // poll every 30s
  });

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export const useMarkRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
};
