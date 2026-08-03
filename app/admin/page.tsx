import type { Metadata } from "next";
import Dashboard from "@/components/admin/Dashboard";
import LoginForm from "@/components/admin/LoginForm";
import { isAuthenticated } from "@/lib/auth";
import { listProjects } from "@/lib/store";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

/** Always rendered per-request: it reads the session cookie and live data. */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) return <LoginForm />;

  return <Dashboard projects={await listProjects()} />;
}
