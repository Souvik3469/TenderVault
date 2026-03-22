import { z } from 'zod';

export const UpdateProfileDto = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  profileImage: z.string().url('Invalid URL').optional(),
  coverImage: z.string().url('Invalid URL').optional(),
  document: z.string().optional(),
});

export const ChangePasswordDto = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileDto>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordDto>;
