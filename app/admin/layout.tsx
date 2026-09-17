import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

// This is a server component, so the role check below runs on every
// request before any admin markup is sent to the browser — unlike the
// client-side checks on /account pages, a non-admin can't even see
// this UI flash before being redirected. The API routes under
// /api/admin/* enforce the same check independently, so the dashboard
// stays safe even if someone hits those endpoints directly.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <AdminSidebar userName={user.name} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
