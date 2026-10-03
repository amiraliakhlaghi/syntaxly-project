"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const reportBlog = async (blogId: string) => {
  const session = await auth();
  const userId = session?.user?.userId ?? null;

  if (!userId) return { error: "Not authorized!" };
  if (!blogId) return { error: "Blog not found!" };

  try {
    const existingReport = await db.report.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    if (existingReport) {
      await db.report.delete({
        where: { id: existingReport.id },
      });

      return { success: "UnReported!" };
    } else {
      await db.report.create({
        data: {
          userId,
          blogId,
        },
      });

      return { success: "Rpeorted!" };
    }
  } catch (error) {
    return { error: "Failed report. Please try again." };
  }
};
