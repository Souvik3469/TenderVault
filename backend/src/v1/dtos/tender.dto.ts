import { z } from 'zod';

export const CreateTenderDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  cost: z.number().positive('Cost must be a positive number'),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export const UpdateTenderDto = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  cost: z.number().positive().optional(),
  status: z.enum(['unsold', 'sold']).optional(),
  imageUrl: z.string().url().optional(),
});

export const ReviewTenderDto = z.object({
  rating: z.number().int().min(1).max(5),
});

export const CreateBidDto = z.object({
  amount: z.number().positive('Bid amount must be a positive number'),
});

export type CreateTenderInput = z.infer<typeof CreateTenderDto>;
export type UpdateTenderInput = z.infer<typeof UpdateTenderDto>;
export type ReviewTenderInput = z.infer<typeof ReviewTenderDto>;
export type CreateBidInput = z.infer<typeof CreateBidDto>;
