import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

// GET /api/v1/tasks — list all tasks for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Build where clause with optional filters
    const where: Record<string, unknown> = { userId };
    if (status && ["PENDING", "IN_PROGRESS", "DONE"].includes(status)) {
      where.status = status;
    }
    if (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      where.priority = priority;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/v1/tasks — create a new task
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: { ...parsed.data, userId },
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
