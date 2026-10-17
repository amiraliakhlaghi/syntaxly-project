"use client";

import { reportBlog } from "@/action/blogs/report-blog";
import { reportComment } from "@/action/comments/report-comment";
import { useReaction } from "@/store/use-reaction";
import { ReportProps } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdReport, MdOutlineReportGmailerrorred } from "react-icons/md";

const Report = (props: ReportProps) => {
  const session = useSession();
  const userId = session.data?.user.userId;

  const reportBlog = useReaction((s) => s.reportBlog);
  const reportComment = useReaction((s) => s.reportComment);

  const storeReported = useReaction((s) =>
    props.Type === "blog"
      ? s.blog[props.blogId]?.userHasReported
      : s.comment[props.commentId]?.userHasReported,
  );

  const reported = storeReported ?? props.initialState ?? false;

  const handleReport = async () => {
    if (!userId) return toast.error("Please Create Account or login!");

    try {
      if (props.Type === "blog") {
        await reportBlog({
          blogId: props.blogId,
          initial: props.fullReactionState,
        });
      } else {
        await reportComment({
          commentId: props.commentId,
          initial: props.fullReactionState,
        });
      }
    } catch {
      toast.error("Failed to report");
    }
  };

  return (
    <span
      onClick={handleReport}
      title={reported ? "Reported" : "Report"}
      className="flex items-center gap-1 cursor-pointer mr-4"
    >
      {reported ? (
        <MdReport size={20} />
      ) : (
        <MdOutlineReportGmailerrorred size={20} />
      )}
      Report
    </span>
  );
};

export default Report;
