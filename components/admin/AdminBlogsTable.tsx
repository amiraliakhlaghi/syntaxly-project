import Link from "next/link";
import moment from "moment";
import AdminDeleteButton from "./AdminDeleteButton";
import AdminHeader from "./AdminHeader";
import { AdminBlogsTableProps } from "@/types";

const AdminBlogsTable = ({
  blogs,
  hasMore,
  total,
  currentSize,
}: AdminBlogsTableProps) => {
  return (
    <div>
      <AdminHeader content="Blogs" total={total} />

      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-slate-950">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="p-3 text-left font-medium">Date Created</th>
              <th className="p-3 text-left font-medium">Cover Image</th>
              <th className="p-3 text-left font-medium">Title</th>
              <th className="p-3 text-left font-medium">Author</th>
              <th className="p-3 text-right font-medium">Delete</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground"
                >
                  No blogs found
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="border-t">
                  <td className="whitespace-nowrap p-3">
                    {moment(blog.createdAt).format("MMM D, YYYY")}
                  </td>

                  <td className="p-3">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="h-12 w-20 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-20 items-center justify-center rounded-md bg-slate-200 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        No image
                      </div>
                    )}
                  </td>

                  <td className="p-3 font-medium">
                    <span className="line-clamp-2 max-w-xs">{blog.title}</span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {blog.user.image ? (
                        <img
                          src={blog.user.image}
                          alt={blog.user.name ?? "Author"}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-medium dark:bg-slate-800">
                          {(
                            blog.user.name?.[0] ?? blog.user.email[0]
                          ).toUpperCase()}
                        </div>
                      )}
                      <span>{blog.user.name ?? "—"}</span>
                    </div>
                  </td>

                  <td className="p-3 text-right">
                    <AdminDeleteButton
                      type="blog"
                      id={blog.id}
                      label={blog.title}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mb-10 mt-6 flex justify-center">
          <Link
            href={`/admin/blogs?size=${currentSize + 10}`}
            scroll={false}
            className="rounded-md border px-6 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Show more
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsTable;
