import { getUsersByAdmin } from "@/action/admin/get-users-by-admin";
import AdminUsersTable from "@/components/admin/AdminUsersTable";

type AdminUsersPageProps = {
  searchParams: Promise<{
    size?: string;
  }>;
};

const AdminUsersPage = async ({ searchParams }: AdminUsersPageProps) => {
  const params = await searchParams;

  const rawSize = Number(params.size);
  const size =
    Number.isFinite(rawSize) && rawSize > 0 ? Math.min(rawSize, 100) : 10;

  const { users, hasMore, total, currentSize } = await getUsersByAdmin({
    size,
  });

  return (
    <AdminUsersTable
      users={users ?? []}
      hasMore={hasMore ?? false}
      total={total ?? 0}
      currentSize={currentSize ?? size}
    />
  );
};

export default AdminUsersPage;
