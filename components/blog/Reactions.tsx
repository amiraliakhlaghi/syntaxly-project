"use client";

import { FaBookmark, FaRegBookmark, FaRegComment } from "react-icons/fa";
import { PiHandsClapping } from "react-icons/pi";
import { BlogWithUser } from "@/types";
import { FaHandsClapping } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useSocket } from "@/store/use-socket";
import { useReaction } from "@/store/use-reaction";

const Reactions = ({ blog }: { blog: BlogWithUser }) => {
  const session = useSession();
  const userId = session.data?.user.userId;

  const storeState = useReaction((s) => s.blog[blog.id]);
  const clapBlog = useReaction((s) => s.clapBlog);
  const bookmarkBlog = useReaction((s) => s.bookmarkBlog);

  const clapCount = storeState?.clapCount ?? blog._count.claps;
  const userHasClapped = storeState?.userHasClapped ?? !!blog.claps.length;
  const userHasBookmarked =
    storeState?.userHasBookmarked ?? !!blog.bookmarks.length;

  const initial = {
    clapCount: blog._count.claps,
    userHasClapped: !!blog.claps.length,
    userHasBookmarked: !!blog.bookmarks.length,
    userHasReported: !!(blog.reports?.length ?? 0),
  };
  const sendNotification = useSocket((s) => s.sendNotification);

  const handleClap = async () => {
    if (!userId) return toast.error("Please Create Account or login!");

    try {
      await clapBlog({
        blogId: blog.id,
        userId,
        blogOwnerId: blog.userId,
        initial,
      });
    } catch {
      toast.error("Failed to clap");
    }
  };

  const handleBookMark = async () => {
    if (!userId) return toast.error("Please Create Account or login!");

    try {
      await bookmarkBlog({
        blogId: blog.id,
        userId,
        initial,
      });
    } catch {
      toast.error("Failed to bookmark");
    }
  };

  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-4">
        <span
          onClick={handleClap}
          className="mr-4 flex items-ceneter gap-1 cursor-pointer"
        >
          {userHasClapped ? (
            <FaHandsClapping size={20} />
          ) : (
            <PiHandsClapping size={20} />
          )}
          {clapCount}
        </span>

        <span className="mr-4 flex items-ceneter gap-1 cursor-pointer">
          <FaRegComment size={18} />
          {blog._count.comments}
        </span>

        <span onClick={handleBookMark}>
          {userHasBookmarked ? (
            <FaBookmark size={18} />
          ) : (
            <FaRegBookmark size={18} />
          )}
        </span>
      </div>
    </div>
  );
};

export default Reactions;
