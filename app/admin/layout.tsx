import { auth } from "@/auth";
import Sidebar from "@/components/admin/Sidebar";
import Alert from "@/components/common/Alert";
import Container from "@/components/layout/Container";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const isAdmin = session?.user.role === "ADMIN";

  if (!isAdmin)
    return (
      <Container>
        <Alert error message="Access Denied" />
      </Container>
    );
    
  return (
    <div className="flex items-stretch min-h-[calc(100vh-64px)]">
      <Sidebar />
      <section className="flex-1 p-6 overflow-x-auto">{children}</section>
    </div>
  );
};

export default AdminLayout;
