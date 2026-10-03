import Link from "next/link";
import moment from "moment";
import { AdminCommentsReportsTableProps } from "@/types";
import AdminDeleteButton from "./AdminDeleteButton";
import AdminHeader from "./AdminHeader";

const AdminCommentsReportsTable = ({
  reports,
  hasMore,
  total,
  currentSize,
}: AdminCommentsReportsTableProps) => {
  return (
    <div>
      <AdminHeader content="Comment Reports" total={total} />

      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-slate-950">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="p-3 text-left font-medium">Date Created</th>
              <th className="p-3 text-left font-medium">Comment Content</th>
              <th className="p-3 text-right font-medium">Delete</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-muted-foreground"
                >
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="whitespace-nowrap p-3">
                    {moment(report.createdAt).format("MMM D, YYYY")}
                  </td>

                  <td className="p-3">
                    {report.comment ? (
                      <p>{report.comment.content}</p>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    {report.comment ? (
                      <AdminDeleteButton
                        type="comment"
                        id={report.comment.id}
                        label={report.comment.content}
                      />
                    ) : null}
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
            href={`/admin/reports?size=${currentSize + 10}`}
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

export default AdminCommentsReportsTable;
