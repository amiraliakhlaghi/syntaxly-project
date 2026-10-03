import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import { ListBlogsProps } from "@/types";

const ListBLogs = ({
  blogs,
  hasMore,
  currentPage,
  isUserProfile,
}: ListBlogsProps) => {
  return (
    <div className="flex flex-col max-w-200 m-auto justify-between min-h-screen px-4 pt-2">
      <section>
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} isUserProfile={isUserProfile} />
        ))}
      </section>

      <Pagination
        currentPage={currentPage}
        hasMore={hasMore}
        isUserProfile={isUserProfile}
      />
    </div>
  );
};

export default ListBLogs;
