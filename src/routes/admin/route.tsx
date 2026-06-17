import {
  createFileRoute,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { requireAuth } from "../../lib/auth-middleware";
import { AdminShell } from "../../components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  // Single auth gate for the whole /admin/* subtree.
  beforeLoad: () => requireAuth(),
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  const matches = useMatches();
  const context = Route.useRouteContext() as { email?: string } | undefined;

  // Pull the page title/subtitle from the deepest matched route's staticData.
  const meta = [...matches]
    .reverse()
    .map((m) => m.staticData as { title?: string; subtitle?: string } | undefined)
    .find((s) => s?.title);

  return (
    <AdminShell
      title={meta?.title}
      subtitle={meta?.subtitle}
      email={context?.email}
    >
      <Outlet />
    </AdminShell>
  );
}
