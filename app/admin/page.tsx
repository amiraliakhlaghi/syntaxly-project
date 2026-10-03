import { redirect } from "next/navigation";

const AdminPage = async () => {
  redirect("/admin/analytics");
};

export default AdminPage;
