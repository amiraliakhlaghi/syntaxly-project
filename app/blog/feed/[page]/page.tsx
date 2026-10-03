import { getPublishedBlogs } from "@/action/blogs/get-published-blogs";
import ListBLogs from "@/components/blog/ListBlogs";
import Alert from "@/components/common/Alert";
import { BlogFeedProps } from "@/types";
import { notFound } from "next/navigation";

const BlogFeed = async ({ params, searchParams }: BlogFeedProps) => {
  const { page } = await params;
  const currentPage = parseInt(page, 10) || 1;
  const searchObj = await searchParams;

  const limit = 5;

  const { success, error } = await getPublishedBlogs({
    page: currentPage,
    limit,
    searchObj,
  });

  if (error) return <Alert error message={error} />;
  if (!success) return <Alert message="No posts!" />;

  const { blogs, hasMore, totalBlogsCount } = success;

  const totalPages = Math.ceil(totalBlogsCount / limit);

  if (totalBlogsCount > 0 && currentPage > totalPages) {
    notFound();
  }

  return (
    <div>
      <ListBLogs blogs={blogs} hasMore={hasMore} currentPage={currentPage} />
    </div>
  );
};

export default BlogFeed;
