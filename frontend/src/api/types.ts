// ─── Standard BE Response Shape ──────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Domain Models ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'company' | 'admin';
  createdAt: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  status: 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';
  deadline?: string;
  imageUrl?: string;
  rating?: number;
  evaluatorId?: string;
  companyId: string;
  company?: User;
  createdAt: string;
  _count?: { bids: number };
}

export interface Bid {
  id: string;
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  tenderId: string;
  vendorId: string;
  vendor?: User;
  tender?: Tender;
  createdAt: string;
}

export interface Answer {
  id: string;
  text: string;
  createdAt: string;
  owner?: { id: string; name: string; role: string; profileImage?: string };
}

export interface Question {
  id: string;
  text: string;
  tenderId: string;
  userId: string;
  asker?: { id: string; name: string; profileImage?: string };
  answers: Answer[];
  createdAt: string;
}

export interface Notification {
  id: string;
  body: string;
  type?: string;
  read: boolean;
  userId: string;
  createdAt: string;
}

export interface TenderStats {
  total: number;
  minAmount: number | null;
  maxAmount: number | null;
  avgAmount: number | null;
  byStatus: Record<string, number>;
}

export interface AdminStats {
  users: { total: number; vendors: number; companies: number };
  tenders: {
    total: number;
    draft: number;
    open: number;
    closed: number;
    awarded: number;
    cancelled: number;
  };
  bids: { total: number };
}

export interface PaginatedTenders {
  tenders: Tender[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'vendor' | 'company';
}

export interface CreateTenderPayload {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline?: string;
  imageUrl?: string;
}

export interface UpdateTenderPayload {
  title?: string;
  description?: string;
  category?: string;
  budget?: number;
  deadline?: string;
  imageUrl?: string;
}

export interface ReviewTenderPayload {
  rating: number;
  comment?: string;
}

export interface CreateBidPayload {
  amount: number;
  message?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
