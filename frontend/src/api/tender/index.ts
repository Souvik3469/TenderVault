import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import type {
  ApiResponse,
  Tender,
  TenderStats,
  Question,
  CreateTenderPayload,
  UpdateTenderPayload,
  ReviewTenderPayload,
  PaginatedTenders,
} from '../types';

// ─── Query key factory ────────────────────────────────────────────────────────
export const tenderKeys = {
  all:        () => ['tenders'] as const,
  mine:       () => ['get-my-tenders'] as const,
  detail:     (id: string) => ['tenderdetails', id] as const,
  categories: () => ['categories'] as const,
  search:     (q: string) => ['search-tenders', q] as const,
  stats:      (id: string) => ['tender-stats', id] as const,
  questions:  (id: string) => ['questions', id] as const,
};

// ─── Raw async functions ──────────────────────────────────────────────────────

export const getAllTenders = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}): Promise<ApiResponse<PaginatedTenders>> => {
  const { data } = await apiClient.get<ApiResponse<PaginatedTenders>>('/tenders', { params });
  return data;
};

export const getMyTender = async (): Promise<ApiResponse<Tender[]>> => {
  const { data } = await apiClient.get<ApiResponse<Tender[]>>('/tenders/mine');
  return data;
};

export const searchTenders = async (name: string): Promise<ApiResponse<Tender[]>> => {
  const { data } = await apiClient.get<ApiResponse<Tender[]>>('/tenders/search', {
    params: { name },
  });
  return data;
};

export const getAllCategories = async (): Promise<ApiResponse<string[]>> => {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/tenders/categories');
  return data;
};

export const uploadTenderImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<ApiResponse<{ imageUrl: string }>>('/tenders/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data!.imageUrl;
};

export const tenderdetails = async (tenderId: string): Promise<ApiResponse<Tender>> => {
  const { data } = await apiClient.get<ApiResponse<Tender>>(`/tenders/${tenderId}`);
  return data;
};

export const createTender = async (payload: CreateTenderPayload): Promise<ApiResponse<Tender>> => {
  const { data } = await apiClient.post<ApiResponse<Tender>>('/tenders', payload);
  return data;
};

export const updateTender = async (
  tenderId: string,
  payload: UpdateTenderPayload
): Promise<ApiResponse<Tender>> => {
  const { data } = await apiClient.put<ApiResponse<Tender>>(`/tenders/${tenderId}`, payload);
  return data;
};

export const deleteTender = async (tenderId: string): Promise<ApiResponse> => {
  const { data } = await apiClient.delete<ApiResponse>(`/tenders/${tenderId}`);
  return data;
};

export const reviewTender = async (
  tenderId: string,
  payload: ReviewTenderPayload
): Promise<ApiResponse<Tender>> => {
  const { data } = await apiClient.put<ApiResponse<Tender>>(
    `/tenders/${tenderId}/review`,
    payload
  );
  return data;
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────

export const publishTender = async (tenderId: string): Promise<ApiResponse<Tender>> => {
  const { data } = await apiClient.patch<ApiResponse<Tender>>(`/tenders/${tenderId}/publish`);
  return data;
};

export const closeTender = async (tenderId: string): Promise<ApiResponse<Tender>> => {
  const { data } = await apiClient.patch<ApiResponse<Tender>>(`/tenders/${tenderId}/close`);
  return data;
};

export const cancelTender = async (tenderId: string): Promise<ApiResponse<Tender>> => {
  const { data } = await apiClient.patch<ApiResponse<Tender>>(`/tenders/${tenderId}/cancel`);
  return data;
};

export const getTenderStats = async (tenderId: string): Promise<ApiResponse<TenderStats>> => {
  const { data } = await apiClient.get<ApiResponse<TenderStats>>(`/tenders/${tenderId}/stats`);
  return data;
};

// ─── Q&A ─────────────────────────────────────────────────────────────────────

export const getQuestions = async (tenderId: string): Promise<ApiResponse<Question[]>> => {
  const { data } = await apiClient.get<ApiResponse<Question[]>>(
    `/tenders/${tenderId}/questions`
  );
  return data;
};

export const askQuestion = async (
  tenderId: string,
  body: string
): Promise<ApiResponse<Question>> => {
  const { data } = await apiClient.post<ApiResponse<Question>>(
    `/tenders/${tenderId}/questions`,
    { text: body }
  );
  return data;
};

export const answerQuestion = async (
  tenderId: string,
  questionId: string,
  answer: string
): Promise<ApiResponse<Question>> => {
  const { data } = await apiClient.post<ApiResponse<Question>>(
    `/tenders/${tenderId}/questions/${questionId}/answers`,
    { text: answer }
  );
  return data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

export const getalltenderquery = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}) =>
  useQuery({
    queryKey: tenderKeys.all(),
    queryFn: () => getAllTenders(params),
    select: (res) => res.data?.tenders ?? [],
  });

export const getMyTendersQuery = () =>
  useQuery({
    queryKey: tenderKeys.mine(),
    queryFn: getMyTender,
    select: (res) => res.data,
  });

export const getallcategoryquery = () =>
  useQuery({
    queryKey: tenderKeys.categories(),
    queryFn: getAllCategories,
    select: (res) => res.data,
  });

export const tenderdetailsquery = (tenderId: string) =>
  useQuery({
    queryKey: tenderKeys.detail(tenderId),
    queryFn: () => tenderdetails(tenderId),
    select: (res) => res.data,
    enabled: !!tenderId,
  });

export const searchTendersQuery = (searchQuery: string) =>
  useQuery({
    queryKey: tenderKeys.search(searchQuery),
    queryFn: () => searchTenders(searchQuery),
    select: (res) => (res.data as any)?.tenders ?? [],
    enabled: searchQuery.length > 0,
  });

export const useTenderStats = (tenderId: string) =>
  useQuery({
    queryKey: tenderKeys.stats(tenderId),
    queryFn: () => getTenderStats(tenderId),
    select: (res) => res.data,
    enabled: !!tenderId,
  });

export const useQuestionsQuery = (tenderId: string) =>
  useQuery({
    queryKey: tenderKeys.questions(tenderId),
    queryFn: () => getQuestions(tenderId),
    select: (res) => res.data,
    enabled: !!tenderId,
  });

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

const invalidateTenderLists = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: tenderKeys.mine() });
  queryClient.invalidateQueries({ queryKey: tenderKeys.all() });
};

export const useCreateTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTenderPayload) => createTender(payload),
    onSuccess: () => invalidateTenderLists(queryClient),
  });
};

export const useUpdateTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenderId, payload }: { tenderId: string; payload: UpdateTenderPayload }) =>
      updateTender(tenderId, payload),
    onSuccess: (_, { tenderId }) => {
      invalidateTenderLists(queryClient);
      queryClient.invalidateQueries({ queryKey: tenderKeys.detail(tenderId) });
    },
  });
};

export const useDeleteTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenderId: string) => deleteTender(tenderId),
    onSuccess: () => invalidateTenderLists(queryClient),
  });
};

export const useReviewTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenderId,
      payload,
    }: {
      tenderId: string;
      payload: ReviewTenderPayload;
    }) => reviewTender(tenderId, payload),
    onSuccess: (_, { tenderId }) => {
      invalidateTenderLists(queryClient);
      queryClient.invalidateQueries({ queryKey: tenderKeys.detail(tenderId) });
    },
  });
};

export const usePublishTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenderId: string) => publishTender(tenderId),
    onSuccess: (_, tenderId) => {
      invalidateTenderLists(queryClient);
      queryClient.invalidateQueries({ queryKey: tenderKeys.detail(tenderId) });
    },
  });
};

export const useCloseTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenderId: string) => closeTender(tenderId),
    onSuccess: (_, tenderId) => {
      invalidateTenderLists(queryClient);
      queryClient.invalidateQueries({ queryKey: tenderKeys.detail(tenderId) });
    },
  });
};

export const useCancelTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenderId: string) => cancelTender(tenderId),
    onSuccess: (_, tenderId) => {
      invalidateTenderLists(queryClient);
      queryClient.invalidateQueries({ queryKey: tenderKeys.detail(tenderId) });
    },
  });
};

export const useAskQuestion = (tenderId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => askQuestion(tenderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenderKeys.questions(tenderId) });
    },
  });
};

export const useAnswerQuestion = (tenderId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) =>
      answerQuestion(tenderId, questionId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenderKeys.questions(tenderId) });
    },
  });
};
