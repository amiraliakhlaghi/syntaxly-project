import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import UserBlogsTabs from "./UserBlogsTabs";
import { BlogWithUser, Filter } from "@/types";

const UserBlogsList = ({
  blogs,
  hasMore,
  filter,
  size,
  userId,
  isOwner,
}: {
  blogs: BlogWithUser[];
  hasMore: boolean;
  filter: Filter;
  size: number;
  userId: string;
  isOwner: boolean;
}) => {
  const nextSize = size + 5;

  return (
    <div className="flex flex-col max-w-200 m-auto px-4 pt-2 mt-3">
      {/* <UserBlogsTabs currentFilter={filter} /> */}

      {isOwner && <UserBlogsTabs currentFilter={filter} />}

      {blogs.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No blogs to show.
        </p>
      ) : (
        <section>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} isUserProfile />
          ))}
        </section>
      )}

      {hasMore && (
        <div className="flex justify-center mt-6 mb-10">
          <Link
            href={`/user/${userId}?tab=${filter}&size=${nextSize}`}
            scroll={false}
            className="px-6 py-2 border rounded-md text-sm font-medium hover:bg-secondary transition-colors"
          >
            Show more
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserBlogsList;
