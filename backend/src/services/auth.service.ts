import bcrypt from "bcrypt";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { ApiError } from "../errors/api-error";
import { jwtConfig } from "../config/jwt";
import jwt, { SignOptions } from "jsonwebtoken";

const SALT_ROUNDS = 10;



export async function registerUser(email: string, password: string) {
  // 1. Проверяем, есть ли пользователь
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    throw ApiError.badRequest("User already exists");
  }
  
  

  // 2. Хешируем пароль
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Сохраняем пользователя
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

export async function loginUser(email: string, password: string) {
  // 1. Ищем пользователя
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  const user = result[0];

  if (!user) {
    throw ApiError.badRequest("Invalid email or password");
  }

  // 2. Проверяем пароль
  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw ApiError.badRequest("Invalid email or password");
  }

  // 3. ЯВНО объявляем options
  const signOptions: SignOptions = {
    expiresIn: jwtConfig.expiresIn,
  };

  // 4. Генерируем JWT
  const accessToken = jwt.sign(
    { userId: user.id },
    jwtConfig.secret,
    signOptions
  );

  // 5. Возвращаем результат
  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
  };
}