import { RecentComment } from "@/types";
import { FaHandsClapping } from "react-icons/fa6";

const RecentComments = ({
  recentComments,
}: {
  recentComments: RecentComment[];
}) => {
  return (
    <ul className="flex flex-col gap-3">
      {recentComments.map((comment) => (
        <li
          key={comment.id}
          className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
        >
          <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-200">
            {comment.content}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate">{comment.user.name ?? "Anonymous"}</span>
            <span className="flex items-center gap-1">
              <FaHandsClapping size={15} />
              {comment._count.claps}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecentComments;
