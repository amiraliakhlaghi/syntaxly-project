import { RecentBlog } from "@/types";
import Image from "next/image";
import Link from "next/link";

const RecentBlogs = ({ recentBlogs }: { recentBlogs: RecentBlog[] }) => {
  return (
    <ul className="flex flex-col gap-3">
      {recentBlogs.map((blog) => (
        <li key={blog.id} className="flex items-center gap-3">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={56}
              height={40}
              unoptimized
              className="h-10 w-14 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-14 shrink-0 rounded-md bg-slate-200 dark:bg-slate-700 " />
          )}
          <div className="min-w-0">
            <Link
              href={`/blog/details/${blog.id}`}
              className="truncate text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-500"
            >
              {blog.title}
            </Link>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              by {blog.user.name ?? "Anonymous"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecentBlogs;
