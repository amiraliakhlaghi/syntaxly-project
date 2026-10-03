import Link from "next/link";
import { BlogWithUser } from "@/types";
import Image from "next/image";
import UserSummary from "./UserSummary";
import Tag from "../common/Tag";
import Reactions from "./Reactions";
import { auth } from "@/auth";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

const BlogCard = async ({
  blog,
  isUserProfile,
}: {
  blog: BlogWithUser;
  isUserProfile?: boolean;
}) => {
  const session = await auth();
  const userId = session?.user.userId;
  const isOwner = userId === blog.userId;
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <div className="border-b border-slate-300 dark:border-slate-700 py-6 cursor-pointer">
      <div className="flex items-center justify-between">
        {blog.user && (
          <UserSummary user={blog.user} createdDate={blog.createdAt} />
        )}

        {isOwner && isUserProfile && !blog.isPublished && (
          <p className="text-rose-500">Draft</p>
        )}

        {(isOwner || isAdmin) && isUserProfile && (
          <Link className="text-orange-400" href={`/blog/edit/${blog.id}`}>
            Edit
          </Link>
        )}
      </div>
      <div className="my-2 flex justify-between gap-6">
        <div className="flex flex-col justify-between w-full">
          <Link
            href={`/blog/details/${blog.id}`}
            className="text-xl sm:text-2xl font-bold"
          >
            {blog.title}
          </Link>

          {!!blog.tags.length && (
            <div className="flex items-center gap-4 flex-wrap my-2">
              {blog.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
          <div className="flex items-center gap-6">
            <Reactions blog={blog} />

            <span className="flex items-center gap-1 text-sm">
              <ChartNoAxesColumnIncreasing size={20} />
              {blog.viewCount?.count ?? 0}
            </span>
          </div>
        </div>

        {blog.coverImage && (
          <Link
            href={`/blog/${blog.id}`}
            className="w-full max-w-40 h-25 relative overflow-hidden"
          >
            <Image
              src={blog.coverImage}
              fill
              alt={blog.title}
              className="object-cover rounded-md"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
