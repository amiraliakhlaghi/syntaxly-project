"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getCommentsByAdmin = async (size: number = 10) => {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    throw new Error("Access Denied");
  }

  const [comments, total] = await Promise.all([
    db.comment.findMany({
      take: size + 1,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        _count: {
          select: { claps: true },
        },
      },
    }),
    db.comment.count(),
  ]);

  const hasMore = comments.length > size;
  const items = hasMore ? comments.slice(0, size) : comments;

  return {
    comments: items,
    hasMore,
    total,
    currentSize: items.length,
  };
};
