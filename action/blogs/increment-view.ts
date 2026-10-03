"use server";

import { cookies } from "next/headers";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

export const incrementBlogView = async (blogId: string) => {
  const session = await auth();
  const cookieStore = await cookies();

  const userId = session?.user?.userId ?? null;
  let visitorId = cookieStore.get("visitorId")?.value;

  if (!userId && !visitorId) {
    visitorId = uuidv4();
    cookieStore.set("visitorId", visitorId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    });
  }

  const existingView = await db.blogView.findFirst({
    where: userId ? { blogId, userId } : { blogId, visitorId },
  });

  if (existingView) {
    return { success: true, counted: false };
  }

  try {
    await db.$transaction([
      db.blogView.create({
        data: {
          blogId,
          userId,
          visitorId: userId ? null : visitorId,
        },
      }),
      db.blogViewCount.upsert({
        where: { blogId },
        update: { count: { increment: 1 } },
        create: { blogId, count: 1 },
      }),
    ]);

    return { success: true, counted: true };
  } catch (error) {
    return { success: false, counted: false };
  }
};
