import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { ApiError } from "../errors/api-error";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    throw ApiError.badRequest("Email and password are required");
  }

  const user = await authService.registerUser(email, password);

  res.status(201).json(user);
};