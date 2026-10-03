"use client";

import { FaBookmark, FaRegBookmark, FaRegComment } from "react-icons/fa";
import { PiHandsClapping } from "react-icons/pi";
import { BlogWithUser } from "@/types";
import { useState } from "react";
import { FaHandsClapping } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { clapBlog } from "@/action/blogs/clap-blog";
import { useRouter } from "next/navigation";
import { bookmarkBlog } from "@/action/blogs/bookmark-blog";
import toast from "react-hot-toast";
import { useSocket } from "@/context/SocketContext";
import { createNotification } from "@/action/notifications/createNotification";

const Reactions = ({ blog }: { blog: BlogWithUser }) => {
  const session = useSession();
  const userId = session.data?.user.userId;
  const { sendNotification } = useSocket();

  const [clapCount, setClapCount] = useState(blog._count.claps);
  const [userHasClapped, setUserHasClapped] = useState(!!blog.claps.length);

  const [userHasBookmarked, setUserHasBookmarked] = useState(
    !!blog.bookmarks.length,
  );

  const router = useRouter();

  const handleClap = async () => {
    if (!userId) return toast.error("Please Create Account or login!");

    const isUnclapping = userHasClapped;

    setClapCount((prevCount) =>
      userHasClapped ? prevCount - 1 : prevCount + 1,
    );
    setUserHasClapped((prevState) => !prevState);

    await clapBlog(blog.id, userId);

    if (!isUnclapping && blog.userId !== userId) {
      await createNotification({
        recipientId: blog.userId,
        type: "NEW_CLAP",
        blogId: blog.id,
        entityType: "BLOG",
      });
      sendNotification(blog.userId);
    }

    router.refresh();
  };

  const handleBookMark = async () => {
    if (!userId) return toast.error("Please Create Account or login!");
    setUserHasBookmarked((prevCount) => !prevCount);
    await bookmarkBlog(blog.id, userId);

    router.refresh();
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
