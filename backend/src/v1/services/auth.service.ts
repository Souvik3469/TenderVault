import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';
import prisma from '../../prisma';
import { env } from '../config/env';
import { AppError } from '../../utils/errors';
import { LoginInput, RegisterInput } from '../dtos/auth.dto';

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.password) throw new AppError('Invalid credentials.', 401);

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) throw new AppError('Invalid credentials.', 401);

  const secret = new TextEncoder().encode(env.USER_ACCESS_SECRET);
  const accessToken = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, accessToken };
};

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError('An account with this email already exists.', 409);

  const hashedPassword = await bcrypt.hash(input.password, 10);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _pw, ...safeUser } = await prisma.user.create({
    data: { ...input, password: hashedPassword },
  });

  return safeUser;
};
