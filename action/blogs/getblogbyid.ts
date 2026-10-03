"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getBlogById = async ({ blogId }: { blogId: string }) => {
  if (!blogId) return { error: "No Blog ID" };

  const session = await auth();
  const userId = session?.user.userId;

  try {
    const blog = await db.blog.findUnique({
      where: { id: blogId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            claps: true,
            comments: true,
          },
        },
        claps: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
        bookmarks: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
        viewCount: {
          select: { count: true },
        },
        reports: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    if (!blog) return { error: "Blog not found!" };

    return { success: { blog } };
  } catch (error) {
    return { error: "Error fetching blog content!" };
  }
};
