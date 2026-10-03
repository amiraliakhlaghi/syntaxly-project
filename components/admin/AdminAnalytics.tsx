import { MdPeople, MdArticle, MdComment } from "react-icons/md";
import StatCard from "./StatCard";
import SectionCard from "./SectionCard";
import { AdminAnalyticsProps } from "@/types";
import RecentUsers from "./RecentUser";
import RecentBlogs from "./RecentBlogs";
import RecentComments from "./RecentComments";
import AdminHeader from "./AdminHeader";

const AdminAnalytics = ({
  totalUsers,
  totalBlogs,
  recentUsers,
  recentBlogs,
  recentComments,
}: AdminAnalyticsProps) => {
  return (
    <div className="flex flex-col gap-6">
      <AdminHeader content="Analytics" />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={MdPeople}
          label="Total Users"
          value={totalUsers}
          color="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        />
        <StatCard
          icon={MdArticle}
          label="Total Blogs"
          value={totalBlogs}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
        />
      </div>

      {/* Recent sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Users */}
        <SectionCard title="Recent Users" icon={MdPeople}>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No users yet.</p>
          ) : (
            <RecentUsers recentUsers={recentUsers} />
          )}
        </SectionCard>

        {/* Recent Blogs */}
        <SectionCard title="Recent Blogs" icon={MdArticle}>
          {recentBlogs.length === 0 ? (
            <p className="text-sm text-slate-500">No blogs yet.</p>
          ) : (
            <RecentBlogs recentBlogs={recentBlogs} />
          )}
        </SectionCard>

        {/* Recent Comments */}
        <SectionCard title="Recent Comments" icon={MdComment}>
          {recentComments.length === 0 ? (
            <p className="text-sm text-slate-500">No comments yet.</p>
          ) : (
            <RecentComments recentComments={recentComments} />
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminAnalytics;
