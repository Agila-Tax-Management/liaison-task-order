import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    let taskOrder = await prisma.taskOrder.findUnique({
      where: { taskOrderNumber: query },
    });

    if (!taskOrder) {
      const matches = await prisma.taskOrder.findMany({
        where: {
          taskOrderNumber: { contains: query },
        },
        take: 1,
      });
      taskOrder = matches[0] ?? null;
    }

    if (!taskOrder) {
      return NextResponse.json(
        { error: `Task Order "${query}" not found` },
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
    console.error("Error searching task order:", error);
    return NextResponse.json(
      { error: "Failed to search task order" },
      { status: 500 }
    );
  }
}