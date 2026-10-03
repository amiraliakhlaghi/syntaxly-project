"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

const adminAnalytics = async () => {
  const session = await auth();

  const isAdmin = session?.user.role === "ADMIN";

  if (!isAdmin) return { error: "Error fetching counts" };

  try {
    const [totalUsers, totalBlogs, recentUsers, recentBlogs, recentComments] =
      await Promise.all([
        db.user.count(),
        db.blog.count(),
        db.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, image: true },
        }),
        db.blog.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            coverImage: true,
            user: { select: { name: true } },
          },
        }),
        db.comment.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            user: { select: { name: true } },
            _count: { select: { claps: true } },
          },
        }),
      ]);

    return { totalUsers, totalBlogs, recentUsers, recentBlogs, recentComments };
  } catch (error) {
    return { error: "Failed to fetch analytics:" };
  }
};

export default adminAnalytics;
