import AdminBlogsTable from "@/components/admin/AdminBlogsTable";
import { getBlogsByAdmin } from "@/action/admin/get-blogs-by-admin";

type AdminBlogsPageProps = {
  searchParams: Promise<{ size?: string }>;
};

const AdminBlogsPage = async ({ searchParams }: AdminBlogsPageProps) => {
  const { size } = await searchParams;
  const currentSize = Math.max(Number(size) || 10, 10);

  const { blogs, hasMore, total } = await getBlogsByAdmin({
    size: currentSize,
  });

  return (
    <AdminBlogsTable
      blogs={blogs}
      hasMore={hasMore}
      total={total}
      currentSize={currentSize}
    />
  );
};

export default AdminBlogsPage;
