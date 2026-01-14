import { Request, Response } from "express";
import { ApiError } from "../errors/api-error";

export const getUsers = async (_req: Request, _res: Response) => {
  throw ApiError.notFound("Users not implemented yet");
};

export const getUserById = async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw ApiError.badRequest("User id is required");
  }

  res.json({ userId: req.params.id });
};