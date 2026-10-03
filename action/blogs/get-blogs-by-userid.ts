"use server";

import { db } from "@/lib/db";
import { Filter } from "@/types";

export const getBlogsByUserId = async ({
  page = 1,
  limit = 5,
  userId,
  filter = "all",
}: {
  page: number;
  limit: number;
  userId: string;
  filter?: Filter;
}) => {
  const skip = (page - 1) * limit;

  let where: any = {};

  switch (filter) {
    case "bookmarks":
      where = { bookmarks: { some: { userId } } };
      break;
    case "claps":
      where = { claps: { some: { userId } } };
      break;
    case "published":
      where = { userId, isPublished: true };
      break;
    case "draft":
      where = { userId, isPublished: false };
      break;
    default:
      where = { userId };
  }

  try {
    const [blogs, totalBlogsCount] = await Promise.all([
      db.blog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where,
        include: {
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { claps: true, comments: true } },
          claps: { where: { userId }, select: { id: true } },
          bookmarks: { where: { userId }, select: { id: true } },
          viewCount: { select: { count: true } },
        },
      }),
      db.blog.count({ where }),
    ]);

    const hasMore = totalBlogsCount > page * limit;

    return { success: { blogs, hasMore } };
  } catch (error) {
    return { error: "Error fetching blogs!" };
  }
};
