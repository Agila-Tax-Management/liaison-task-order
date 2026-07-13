import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { clickupUpdated } = body;

    if (typeof clickupUpdated !== "boolean") {
      return NextResponse.json(
        { error: "clickupUpdated must be a boolean" },
        { status: 400 }
      );
    }

    const updated = await prisma.taskOrder.update({
      where: { id: numericId },
      data: { clickupUpdated },
    });

    return NextResponse.json({
      ...updated,
      dateRequested: updated.dateRequested.toISOString(),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating task order:", error);
    return NextResponse.json(
      { error: "Failed to update task order" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const taskOrder = await prisma.taskOrder.findUnique({
      where: { id: numericId },
    });

    if (!taskOrder) {
      return NextResponse.json(
        { error: "Task order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...taskOrder,
      dateRequested: taskOrder.dateRequested.toISOString(),
      createdAt: taskOrder.createdAt.toISOString(),
      updatedAt: taskOrder.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching task order:", error);
    return NextResponse.json(
      { error: "Failed to fetch task order" },
      { status: 500 }
    );
  }
}