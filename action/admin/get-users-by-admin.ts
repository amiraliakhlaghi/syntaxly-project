"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

type GetUsersByAdminParams = {
  size?: number;
};

export const getUsersByAdmin = async ({
  size = 10,
}: GetUsersByAdminParams = {}) => {
  const session = await auth();

  const isAdmin = session?.user.role === "ADMIN";

  if (!isAdmin) return { error: "Error fetching data" };

  const take = Math.min(Math.max(size, 1), 100);

  const [users, total] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    }),
    db.user.count(),
  ]);

  const hasMore = total > take;

  return {
    users,
    total,
    hasMore,
    currentSize: take,
  };
};
