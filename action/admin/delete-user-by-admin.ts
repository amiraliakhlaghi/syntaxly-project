"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function deleteUserByAdmin(userId: string) {
  const session = await auth();

  const isAdmin = session?.user.role === "ADMIN";

  if (!isAdmin) return { error: "Error fetching data" };

  const currentUserId = (session.user as { id?: string }).id;

  if (currentUserId === userId) {
    throw new Error("You cannot delete your own account");
  }

  try {
    await db.user.delete({
      where: { id: userId },
    });
  } catch {
    throw new Error("User not found or already deleted");
  }
}
