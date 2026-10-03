import Link from "next/link";
import moment from "moment";
import { AdminUser, AdminUsersTableProps } from "@/types";
import AdminHeader from "./AdminHeader";
import AdminDeleteButton from "./AdminDeleteButton";

const AdminUsersTable = ({
  users,
  hasMore,
  total,
  currentSize,
}: AdminUsersTableProps) => {
  return (
    <div>
      <AdminHeader content="Users" total={total} />

      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-slate-950">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="p-3 text-left font-medium">Date Created</th>
              <th className="p-3 text-left font-medium">User Image</th>
              <th className="p-3 text-left font-medium">Username</th>
              <th className="p-3 text-left font-medium">Email</th>
              <th className="p-3 text-right font-medium">Delete</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="whitespace-nowrap p-3">
                    {moment(user.createdAt).format("MMM D, YYYY")}
                  </td>

                  <td className="p-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name ?? "User"}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-medium dark:bg-slate-800">
                        {(user.name?.[0] ?? user.email[0]).toUpperCase()}
                      </div>
                    )}
                  </td>

                  <td className="p-3 font-medium hover:text-blue-500">
                    <Link href={`/user/${user.id}`}>{user.name ?? "—"}</Link>
                  </td>

                  <td className="p-3 text-muted-foreground">{user.email}</td>

                  <td className="p-3 text-right">
                    <AdminDeleteButton
                      type="user"
                      id={user.id}
                      label={user.name ?? user.email}
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
            href={`/admin/users?size=${currentSize + 10}`}
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

export default AdminUsersTable;
