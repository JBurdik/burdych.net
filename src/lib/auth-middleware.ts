import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw redirect({ to: "/login" });
  }

  return next({ context: { session } });
});

// Lightweight session check for route `beforeLoad` gating. Returning a plain
// serializable object (no Date) and redirecting from beforeLoad — rather than
// throwing redirect inside a server middleware — keeps the auth gate working
// in both the Vite dev server and production builds.
export const fetchSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session) return null;
    return { userId: session.user.id, email: session.user.email };
  },
);

/** Throws a redirect to /login when there is no active session. */
export async function requireAuth() {
  const session = await fetchSession();
  if (!session) {
    throw redirect({ to: "/login" });
  }
  return session;
}
