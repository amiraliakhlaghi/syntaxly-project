import adminAnalytics from "@/action/admin/admin-analytics";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import Alert from "@/components/common/Alert";

const AnalyticsPage = async () => {
  const analytics = await adminAnalytics();
  if (analytics?.error) return <Alert error message={analytics.error} />;

  return (
    <AdminAnalytics
      totalUsers={analytics?.totalUsers ?? 0}
      totalBlogs={analytics?.totalBlogs ?? 0}
      recentUsers={analytics?.recentUsers ?? []}
      recentBlogs={analytics?.recentBlogs ?? []}
      recentComments={analytics?.recentComments ?? []}
    />
  );
};

export default AnalyticsPage;
