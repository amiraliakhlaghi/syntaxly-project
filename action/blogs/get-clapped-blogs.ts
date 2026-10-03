"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getClappedBlogs = async ({
  page = 1,
  limit = 5,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const session = await auth();
  const userId = session?.user.userId;

  if (!userId) return { error: "User not found" };

  try {
    const claps = await db.clap.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      where: { userId },
      include: {
        blog: {
          include: {
            user: { select: { id: true, name: true, image: true } },
            _count: { select: { claps: true, comments: true } },
            claps: { where: { userId }, select: { id: true } },
            bookmarks: { where: { userId }, select: { id: true } },
            viewCount: { select: { count: true } },
          },
        },
      },
    });

    const blogs = claps.filter((c) => c.blog !== null).map((c) => c.blog);

    const totalClaps = await db.clap.count({ where: { userId } });
    const hasMore = totalClaps > page * limit;

    return { success: { blogs, hasMore } };
  } catch (error) {
    return { error: "Error fetching clapped blogs!" };
  }
};
