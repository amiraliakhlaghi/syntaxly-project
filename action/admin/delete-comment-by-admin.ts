"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteCommentByAdmin = async (commentId: string) => {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    throw new Error("Access Denied");
  }

  if (!commentId) {
    throw new Error("Comment ID is required");
  }

  await db.comment.delete({
    where: { id: commentId },
  });

  revalidatePath("/admin/comments");
};
