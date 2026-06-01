import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";

// GET /api/v1/admin/users — admin-only: list all users
export async function GET() {
  try {
    await requireAdmin();

    const client = await clerkClient();
    const users = await client.users.getUserList();

    const data = users.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.publicMetadata?.role || "user",
      createdAt: user.createdAt,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ success: false, error: "Forbidden — admin access required" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
