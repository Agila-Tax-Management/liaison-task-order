import { prisma } from "@/lib/prisma";
import { PageClient } from "@/app/page-client";
import { serializeTaskOrder } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  try {
    const allTaskOrders = await prisma.taskOrder.findMany({
      orderBy: { createdAt: "desc" },
    });

    const closedTaskOrders = allTaskOrders
      .filter((t) => t.taskStatus === "Done, forwarded to CRT")
      .map(serializeTaskOrder);

    const openTaskOrders = allTaskOrders
      .filter((t) => t.taskStatus !== "Done, forwarded to CRT")
      .map(serializeTaskOrder);

    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Back to Portal Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go to Task Portal
          </Link>
        </div>

        {/* Branding - Blue/Purple Gradient Text */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent sm:text-4xl">
            Agila Liaison Task Order
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Manage and track task orders for the Agila Liaison Office.
          </p>
        </div>

        <PageClient
          openTaskOrders={openTaskOrders}
          closedTaskOrders={closedTaskOrders}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading task orders:", error);
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error loading task orders. Please try again.
        </div>
      </div>
    );
  }
}