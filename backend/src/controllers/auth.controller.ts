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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    throw ApiError.badRequest("Email and password are required");
  }

  const {
    user,
    accessToken,
    refreshToken,
    refreshTokenExpiresAt,
  } = await authService.loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: refreshTokenExpiresAt,
  });

  res.json({ user, accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw ApiError.unauthorized("No refresh token");
  }

  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie("refreshToken");
  res.status(204).send();
};