"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getBlogsByAdmin = async ({ size = 10 }: { size?: number }) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Access Denied");
  }

  const blogs = await db.blog.findMany({
    where: { isPublished: true },
    take: size + 1,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  const hasMore = blogs.length > size;
  const data = hasMore ? blogs.slice(0, size) : blogs;

  const total = await db.blog.count({ where: { isPublished: true } });

  return { blogs: data, hasMore, total };
};
