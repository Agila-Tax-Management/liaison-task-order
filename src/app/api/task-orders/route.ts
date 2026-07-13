import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const taskOrders = await prisma.taskOrder.findMany({
      orderBy: { createdAt: "desc" },
    });

    const serialized = taskOrders.map((t) => ({
      ...t,
      dateRequested: t.dateRequested.toISOString(),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error fetching task orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch task orders" },
      { status: 500 }
    );
  }
}