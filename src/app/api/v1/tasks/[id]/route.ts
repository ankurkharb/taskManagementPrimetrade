import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

// GET /api/v1/tasks/:id — get a single task
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== userId) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: task });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/v1/tasks/:id — update a task
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: task });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/v1/tasks/:id — delete a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Task deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
