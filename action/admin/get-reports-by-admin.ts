"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

const PAGE_SIZE = 10;

type GetReportsParams = {
  type: "BLOG" | "COMMENT";
  size?: number;
};

export const getReportsByAdmin = async ({
  type,
  size = PAGE_SIZE,
}: GetReportsParams) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Access Denied");
  }

  const where =
    type === "BLOG" ? { blogId: { not: null } } : { commentId: { not: null } };

  const [rawReports, total] = await Promise.all([
    db.report.findMany({
      where,
      include: {
        blog: { select: { id: true, title: true } },
        comment: {
          select: {
            id: true,
            // blogId: true,
            // blog: { select: { id: true, title: true } },
            content: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: size + 1,
    }),
    db.report.count({ where }),
  ]);

  const hasMore = rawReports.length > size;
  const reports = hasMore ? rawReports.slice(0, size) : rawReports;

  return {
    reports,
    hasMore,
    total,
  };
};
