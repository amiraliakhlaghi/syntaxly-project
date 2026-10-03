import Link from "next/link";
import moment from "moment";
import { AdminComment, AdminCommentsTableProps } from "@/types";
import AdminDeleteButton from "./AdminDeleteButton";
import AdminHeader from "./AdminHeader";

const AdminCommentsTable = ({
  comments,
  hasMore,
  total,
  currentSize,
}: AdminCommentsTableProps) => {
  return (
    <div>
      <AdminHeader content="Comments" total={total} />

      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-slate-950">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="p-3 text-left font-medium">Date Created</th>
              <th className="p-3 text-left font-medium">Comments Content</th>
              <th className="p-3 text-left font-medium">Claps</th>
              <th className="p-3 text-left font-medium">Author</th>
              <th className="p-3 text-right font-medium">Delete</th>
            </tr>
          </thead>

          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground"
                >
                  No comments found
                </td>
              </tr>
            ) : (
              comments.map((comment) => (
                <tr key={comment.id} className="border-t align-top">
                  <td className="whitespace-nowrap p-3">
                    {moment(comment.createdAt).format("MMM D, YYYY")}
                  </td>

                  <td className="max-w-md p-3">
                    <p className="line-clamp-3 break-words">
                      {comment.content}
                    </p>
                  </td>

                  <td className="p-3 font-medium">{comment._count.claps}</td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {comment.user.image ? (
                        <img
                          src={comment.user.image}
                          alt={comment.user.name ?? "User"}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-medium dark:bg-slate-800">
                          {(
                            comment.user.name?.[0] ?? comment.user.email[0]
                          ).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">
                        {comment.user.name ?? comment.user.email}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-right">
                    <AdminDeleteButton
                      type="comment"
                      id={comment.id}
                      label={comment.user.name}
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
            href={`/admin/comments?size=${currentSize + 10}`}
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

export default AdminCommentsTable;
