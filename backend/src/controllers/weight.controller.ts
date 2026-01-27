import { Request, Response } from "express";
import * as weightService from "../services/weight.service";
import { ApiError } from "../errors/api-error";

export const createWeightEntry = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).user?.id;
  const { weight, note } = req.body as {
    weight?: number;
    note?: string;
  };

  if (!userId) {
    throw ApiError.unauthorized();
  }

  if (typeof weight !== "number" || weight <= 0) {
    throw ApiError.badRequest("Weight must be a positive number");
  }

  const entry = await weightService.createWeightEntry(
    userId,
    weight,
    note
  );

  res.status(201).json(entry);
};

export const getWeightEntries = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    throw ApiError.unauthorized();
  }

  const entries = await weightService.getUserWeightEntries(userId);
  res.json(entries);
};

export const getWeightEntryById = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  if (!userId || typeof id !== "string") {
    throw ApiError.badRequest();
  }

  const entry = await weightService.getUserWeightEntryById(
    userId,
    id
  );

  if (!entry) {
    throw ApiError.notFound("Weight entry not found");
  }

  res.json(entry);
};

export const deleteWeightEntry = async (
  req: Request,
  res: Response
) => {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  if (!userId || typeof id !== "string") {
    throw ApiError.badRequest();
  }

  await weightService.deleteUserWeightEntry(userId, id);
  res.status(204).send();
};