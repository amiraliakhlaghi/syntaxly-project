"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const reportComment = async (commentId: string) => {
  const session = await auth();
  const userId = session?.user?.userId;

  if (!userId) return { error: "Not authorized!" };
  if (!commentId) return { error: "Comment not found!" };

  try {
    const existingReport = await db.report.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
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
          commentId,
        },
      });

      return { success: "Rpeorted!" };
    }
  } catch (error) {
    return { error: "Failed report. Please try again." };
  }
};
