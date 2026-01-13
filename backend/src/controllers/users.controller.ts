import { Request, Response } from "express";

export const getUsers = async (_req: Request, res: Response) => {
  res.json({ message: "get users" });
};

export const getUserById = async (req: Request, res: Response) => {
  res.json({ userId: req.params.id });
};