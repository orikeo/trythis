import { db } from "../db";
import { weightEntries } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function createWeightEntry(
  userId: string,
  weight: number,
  note?: string
) {
  const result = await db
    .insert(weightEntries)
    .values({
      userId,
      weight: weight.toString(), // numeric → string
      note,
    })
    .returning();

  return result[0];
}

export async function getUserWeightEntries(userId: string) {
  return db
    .select()
    .from(weightEntries)
    .where(eq(weightEntries.userId, userId))
    .orderBy(desc(weightEntries.createdAt));
}

export async function getUserWeightEntryById(
  userId: string,
  entryId: string
) {
  const result = await db
    .select()
    .from(weightEntries)
    .where(
      and(
        eq(weightEntries.id, entryId),
        eq(weightEntries.userId, userId)
      )
    );

  return result[0] ?? null;
}

export async function deleteUserWeightEntry(
  userId: string,
  entryId: string
) {
  await db
    .delete(weightEntries)
    .where(
      and(
        eq(weightEntries.id, entryId),
        eq(weightEntries.userId, userId)
      )
    );
}