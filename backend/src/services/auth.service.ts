import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";

import { db } from "../db";
import { users, refreshTokens } from "../db/schema";
import { ApiError } from "../errors/api-error";
import { jwtConfig } from "../config/jwt";
import { authConfig } from "../config/auth";

/**
 * Регистрация
 */
export async function registerUser(email: string, password: string) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existing.length > 0) {
    throw ApiError.badRequest("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db
    .insert(users)
    .values({
      email,
      passwordHash,
    })
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    });

  return result[0];
}

/**
 * Логин
 * Возвращает access + refresh
 */
export async function loginUser(email: string, password: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  const user = result[0];

  if (!user) {
    throw ApiError.badRequest("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw ApiError.badRequest("Invalid email or password");
  }

  // access token
  const signOptions: SignOptions = {
    expiresIn: jwtConfig.expiresIn,
  };

  const accessToken = jwt.sign(
    { userId: user.id },
    jwtConfig.secret,
    signOptions
  );

  // refresh token
  const refreshToken = uuidv4();
  const refreshTokenExpiresAt = addDays(
    new Date(),
    authConfig.refreshTokenDays
  );

  await db.insert(refreshTokens).values({
    userId: user.id,
    token: refreshToken,
    expiresAt: refreshTokenExpiresAt,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
    refreshTokenExpiresAt,
  };
}

/**
 * Обновление access token
 */
export async function refreshAccessToken(refreshToken: string) {
  const result = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken));

  const token = result[0];

  if (!token || token.expiresAt < new Date()) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const signOptions: SignOptions = {
    expiresIn: jwtConfig.expiresIn,
  };

  return jwt.sign(
    { userId: token.userId },
    jwtConfig.secret,
    signOptions
  );
}

/**
 * Logout
 */
export async function logout(refreshToken: string) {
  await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken));
}