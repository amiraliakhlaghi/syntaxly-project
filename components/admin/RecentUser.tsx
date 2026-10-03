import { RecentUser } from "@/types";
import Image from "next/image";
import Link from "next/link";

const RecentUsers = ({ recentUsers }: { recentUsers: RecentUser[] }) => {
  return (
    <ul className="flex flex-col gap-3">
      {recentUsers.map((user) => (
        <li key={user.id} className="flex items-center gap-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "user"}
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer hover:text-blue-600">
            <Link href={`/user/${user.id}`}>{user.name ?? "Anonymous"}</Link>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default RecentUsers;
