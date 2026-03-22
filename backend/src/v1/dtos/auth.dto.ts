import { z } from 'zod';

export const LoginDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterDto = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['vendor', 'company']).default('vendor'),
});

export type LoginInput = z.infer<typeof LoginDto>;
export type RegisterInput = z.infer<typeof RegisterDto>;
