"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const deleteBlogByAdmin = async (blogId: string) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Access Denied");
  }

  if (!blogId) {
    throw new Error("Blog id is required");
  }

  const blog = await db.blog.findUnique({ where: { id: blogId } });

  if (!blog) {
    throw new Error("Blog not found");
  }

  await db.blog.delete({ where: { id: blogId } });

  return { success: true };
};
