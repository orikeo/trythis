import { db } from "../db";
import { notes } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function createNote(
  userId: string,
  title: string,
  content?: string
) {
  const result = await db
    .insert(notes)
    .values({
      userId,
      title,
      content,
    })
    .returning();

  return result[0];
}

export async function getUserNotes(userId: string) {
  return db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.createdAt));
}

export async function getUserNoteById(
  userId: string,
  noteId: string
) {
  const result = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.id, noteId),
        eq(notes.userId, userId)
      )
    );

  return result[0] ?? null;
}

export async function deleteUserNote(
  userId: string,
  noteId: string
) {
  await db
    .delete(notes)
    .where(
      and(
        eq(notes.id, noteId),
        eq(notes.userId, userId)
      )
    );
}