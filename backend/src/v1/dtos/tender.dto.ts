import { z } from 'zod';

export const CreateTenderDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  cost: z.number().positive('Cost must be a positive number'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  // ISO 8601 string from client, converted to Date in service
  deadline: z.string().datetime({ message: 'Deadline must be a valid ISO date string' }).optional(),
});

export const UpdateTenderDto = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  cost: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  deadline: z.string().datetime().optional(),
  // status not editable here — use /publish, /close, /cancel endpoints
});

export const ReviewTenderDto = z.object({
  rating: z.number().int().min(1).max(5),
});

export const CreateBidDto = z.object({
  amount: z.number().positive('Bid amount must be a positive number'),
  message: z.string().max(1000).optional(),
});

export const QuestionDto = z.object({
  text: z.string().min(1, 'Question text is required').max(500),
});

export const AnswerDto = z.object({
  text: z.string().min(1, 'Answer text is required').max(1000),
});

export type CreateTenderInput = z.infer<typeof CreateTenderDto>;
export type UpdateTenderInput = z.infer<typeof UpdateTenderDto>;
export type ReviewTenderInput = z.infer<typeof ReviewTenderDto>;
export type CreateBidInput = z.infer<typeof CreateBidDto>;
export type QuestionInput = z.infer<typeof QuestionDto>;
export type AnswerInput = z.infer<typeof AnswerDto>;
