import { Request, Response } from "express";
import * as usersService from "../services/users.service";
import { ApiError } from "../errors/api-error";

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // ✅ защита от string[]
  if (typeof id !== "string") {
    throw ApiError.badRequest("Invalid user id");
  }

  const user = await usersService.getUserById(id);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { email, passwordHash } = req.body as {
    email?: string;
    passwordHash?: string;
  };

  if (typeof email !== "string" || typeof passwordHash !== "string") {
    throw ApiError.badRequest("email and passwordHash are required");
  }

  const user = await usersService.createUser({
    email,
    passwordHash,
  });

  res.status(201).json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw ApiError.badRequest("Invalid user id");
  }

  await usersService.deleteUser(id);
  res.status(204).send();
};