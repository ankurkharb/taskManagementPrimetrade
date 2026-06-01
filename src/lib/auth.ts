import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED");
  return userId;
}

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (user.publicMetadata?.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
