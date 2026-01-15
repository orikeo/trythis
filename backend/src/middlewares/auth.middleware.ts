import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { ApiError } from "../errors/api-error";

interface JwtPayload {
  userId: string;
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw ApiError.unauthorized("No authorization header");
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw ApiError.unauthorized("Invalid authorization format");
  }

  try {
    const payload = jwt.verify(
      token,
      jwtConfig.secret
    ) as JwtPayload;

    // 👇 кладём данные пользователя в request
    (req as any).user = {
      id: payload.userId,
    };

    next();
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
}