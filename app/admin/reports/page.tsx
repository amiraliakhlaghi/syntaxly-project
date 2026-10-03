import { getReportsByAdmin } from "@/action/admin/get-reports-by-admin";
import AdminBlogsReportsTable from "@/components/admin/AdminBlogsReportsTable";
import AdminCommentsReportsTable from "@/components/admin/AdminCommentsReportsTable";

type Props = {
  searchParams: Promise<{ size?: string }>;
};

const AdminReportsPage = async ({ searchParams }: Props) => {
  const { size } = await searchParams;
  const currentSize = Math.max(Number(size) || 10, 10);

  const [blogReportsData, commentReportsData] = await Promise.all([
    getReportsByAdmin({ type: "BLOG", size: currentSize }),
    getReportsByAdmin({ type: "COMMENT", size: currentSize }),
  ]);

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-2">
      <AdminBlogsReportsTable
        reports={blogReportsData.reports}
        hasMore={blogReportsData.hasMore}
        total={blogReportsData.total}
        currentSize={currentSize}
      />

      <AdminCommentsReportsTable
        reports={commentReportsData.reports}
        hasMore={commentReportsData.hasMore}
        total={commentReportsData.total}
        currentSize={currentSize}
      />
    </div>
  );
};

export default AdminReportsPage;
