import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { NewUser, User } from "../db/schema";

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users);
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  return result[0] ?? null;
}

export async function createUser(data: NewUser): Promise<User> {
  const result = await db
    .insert(users)
    .values(data)
    .returning();

  return result[0];
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}