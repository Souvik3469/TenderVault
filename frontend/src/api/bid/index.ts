import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type { ApiResponse, Bid, CreateBidPayload } from '../types';
import { tenderKeys } from '../tender';

// ─── Query key factory ────────────────────────────────────────────────────────
export const bidKeys = {
  forTender: (tenderId: string) => ['getallbids', tenderId] as const,
  detail:    (bidId: string) => ['bid', bidId] as const,
};

// ─── Raw async functions ──────────────────────────────────────────────────────

export const getallbids = async (tenderId: string): Promise<ApiResponse<Bid[]>> => {
  const { data } = await apiClient.get<ApiResponse<Bid[]>>(`/tenders/${tenderId}/bids`);
  return data;
};

export const getBidById = async (tenderId: string, bidId: string): Promise<ApiResponse<Bid>> => {
  const { data } = await apiClient.get<ApiResponse<Bid>>(
    `/tenders/${tenderId}/bids/${bidId}`
  );
  return data;
};

export const createbid = async (
  tenderId: string,
  payload: CreateBidPayload
): Promise<ApiResponse<Bid>> => {
  const { data } = await apiClient.post<ApiResponse<Bid>>(
    `/tenders/${tenderId}/bids`,
    payload
  );
  return data;
};

export const deletebid = async (bidId: string): Promise<ApiResponse> => {
  const { data } = await apiClient.delete<ApiResponse>(`/tenders/bids/${bidId}`);
  return data;
};

export const acceptBid = async (bidId: string): Promise<ApiResponse<Bid>> => {
  const { data } = await apiClient.put<ApiResponse<Bid>>(`/tenders/bids/${bidId}/accept`);
  return data;
};

export const rejectBid = async (bidId: string): Promise<ApiResponse<Bid>> => {
  const { data } = await apiClient.put<ApiResponse<Bid>>(`/tenders/bids/${bidId}/reject`);
  return data;
};

export const withdrawBid = async (bidId: string): Promise<ApiResponse<Bid>> => {
  const { data } = await apiClient.patch<ApiResponse<Bid>>(`/tenders/bids/${bidId}/withdraw`);
  return data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

/** All bids for a tender */
export const getallbidsquery = (tenderId: string) =>
  useQuery({
    queryKey: bidKeys.forTender(tenderId),
    queryFn: () => getallbids(tenderId),
    select: (res) => res.data,
    enabled: !!tenderId,
  });

/** Single bid */
export const useBidDetail = (tenderId: string, bidId: string) =>
  useQuery({
    queryKey: bidKeys.detail(bidId),
    queryFn: () => getBidById(tenderId, bidId),
    select: (res) => res.data,
    enabled: !!tenderId && !!bidId,
  });

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export const useCreateBid = (tenderId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBidPayload) => createbid(tenderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bidKeys.forTender(tenderId) });
      queryClient.invalidateQueries({ queryKey: tenderKeys.detail(tenderId) });
    },
  });
};

export const useDeleteBid = (tenderId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => deletebid(bidId),
    onSuccess: () => {
      if (tenderId) {
        queryClient.invalidateQueries({ queryKey: bidKeys.forTender(tenderId) });
      }
    },
  });
};

export const useAcceptBid = (tenderId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => acceptBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bidKeys.forTender(tenderId) });
      queryClient.invalidateQueries({ queryKey: tenderKeys.detail(tenderId) });
      queryClient.invalidateQueries({ queryKey: tenderKeys.mine() });
    },
  });
};

export const useRejectBid = (tenderId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => rejectBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bidKeys.forTender(tenderId) });
    },
  });
};

export const useWithdrawBid = (tenderId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => withdrawBid(bidId),
    onSuccess: () => {
      if (tenderId) {
        queryClient.invalidateQueries({ queryKey: bidKeys.forTender(tenderId) });
      }
      queryClient.invalidateQueries({ queryKey: ['my-bids'] });
    },
  });
};
