"use client";

import { reportBlog } from "@/action/blogs/report-blog";
import { reportComment } from "@/action/comments/report-comment";
import { ReportProps } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdReport, MdOutlineReportGmailerrorred } from "react-icons/md";

const Report = ({ blogId, commentId, Type, initialState }: ReportProps) => {
  const session = useSession();
  const userId = session.data?.user.userId;

  const [reported, setReported] = useState(initialState);

  const handleReport = async () => {
    if (!userId) return toast.error("Please Create Account or login!");

    const id = Type === "blog" ? blogId : commentId;
    if (!id) return;

    const res =
      Type === "blog" ? await reportBlog(id) : await reportComment(id);
    if (res?.error) return toast.error(res.error);

    setReported((prevState) => !prevState);
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
