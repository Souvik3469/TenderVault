import { z } from 'zod';

// `cost` is the legacy field name and is still accepted from existing clients.
// `minimumBid` is the current name. Exactly one is required; both are normalised
// to `minimumBid` before reaching the service.
export const CreateTenderDto = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    minimumBid: z.number().positive('Minimum bid must be a positive number').optional(),
    cost: z.number().positive('Cost must be a positive number').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    // ISO 8601 string from client, converted to Date in service
    deadline: z.string().datetime({ message: 'Deadline must be a valid ISO date string' }).optional(),
  })
  .refine((d) => d.minimumBid !== undefined || d.cost !== undefined, {
    message: 'minimumBid is required',
    path: ['minimumBid'],
  })
  .transform(({ cost, ...rest }) => ({
    ...rest,
    minimumBid: (rest.minimumBid ?? cost) as number,
  }));

export const UpdateTenderDto = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    category: z.string().min(1).optional(),
    minimumBid: z.number().positive().optional(),
    cost: z.number().positive().optional(), // legacy alias
    imageUrl: z.string().url().optional(),
    deadline: z.string().datetime().optional(),
    // status not editable here — use /publish, /close, /cancel endpoints
  })
  .transform(({ cost, ...rest }) => ({
    ...rest,
    ...(rest.minimumBid ?? cost) !== undefined ? { minimumBid: rest.minimumBid ?? cost } : {},
  }));

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
