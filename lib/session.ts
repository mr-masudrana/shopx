import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
  });

  return user;
}

/**
 * Like getSessionUser, but returns null unless the logged-in user has
 * the "admin" role. Use this at the top of every admin-only API route
 * and server component — never trust a client-side role check alone.
 */
export async function getAdminUser() {
  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}
