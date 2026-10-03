import AdminCommentsTable from "@/components/admin/AdminCommentsTable";
import { getCommentsByAdmin } from "@/action/admin/get-comments-by-admin";

type CommentsPageProps = {
  searchParams: Promise<{ size?: string }>;
};

const CommentsPage = async ({ searchParams }: CommentsPageProps) => {
  const { size } = await searchParams;
  const currentSize = Number(size) > 0 ? Number(size) : 10;

  const { comments, hasMore, total } = await getCommentsByAdmin(currentSize);

  return (
    <AdminCommentsTable
      comments={comments}
      hasMore={hasMore}
      total={total}
      currentSize={comments.length}
    />
  );
};

export default CommentsPage;
