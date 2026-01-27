import { Request, Response } from "express";
import * as notesService from "../services/notes.service";
import { ApiError } from "../errors/api-error";

export const createNote = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { title, content } = req.body as {
    title?: string;
    content?: string;
  };

  if (!userId) {
    throw ApiError.unauthorized();
  }

  if (typeof title !== "string" || title.length === 0) {
    throw ApiError.badRequest("Title is required");
  }

  const note = await notesService.createNote(
    userId,
    title,
    content
  );

  res.status(201).json(note);
};

export const getNotes = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    throw ApiError.unauthorized();
  }

  const notes = await notesService.getUserNotes(userId);
  res.json(notes);
};

export const getNoteById = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  if (!userId || typeof id !== "string") {
    throw ApiError.badRequest();
  }

  const note = await notesService.getUserNoteById(userId, id);

  if (!note) {
    throw ApiError.notFound("Note not found");
  }

  res.json(note);
};

export const deleteNote = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  if (!userId || typeof id !== "string") {
    throw ApiError.badRequest();
  }

  await notesService.deleteUserNote(userId, id);
  res.status(204).send();
};