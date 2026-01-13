import { Request, Response } from "express";

export const getNotes = async (_req: Request, res: Response) => {
  res.json({ message: "get notes" });
};