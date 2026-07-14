"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PortalUpdateForm } from "@/components/PortalUpdateForm";
import type { TaskOrderSerialized } from "@/types";
import { formatDate } from "@/lib/utils";

interface TaskDetailPageProps {
  params: Promise<{
    taskOrderNumber: string;
  }>;
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter();
  const { taskOrderNumber } = use(params);
  
  // Fetch task data on client side
  const [taskOrder, setTaskOrder] = useState<TaskOrderSerialized | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await fetch(`/api/task-orders/search?q=${taskOrderNumber}`);
        if (!res.ok) {
          setError("Task order not found");
          return;
        }
        const data = await res.json();
        setTaskOrder(data);
      } catch {
        setError("Failed to load task order");
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [taskOrderNumber]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading task order...</p>
        </div>
      </div>
    );
  }

  if (error || !taskOrder) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Task order not found"}
        </div>
        <div className="mt-4">
          <Link href="/portal" className="text-blue-700 hover:underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/portal" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="rounded-xl border border-slate-200 bg-linear-to-r from-blue-700 to-blue-900 px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                Task Order Found
              </p>
              <p className="mt-1 font-mono text-lg font-bold tracking-wide">
                {taskOrder.taskOrderNumber}
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                {taskOrder.taskName}
              </h1>
              {taskOrder.taskStatus && (
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {taskOrder.taskStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-xl font-bold text-slate-900">Task Details</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="Client Name" value={taskOrder.clientName} />
          <DetailRow label="Location" value={taskOrder.location} />
          <DetailRow label="Requested By" value={taskOrder.requestedBy} />
          <DetailRow label="Date Requested" value={formatDate(taskOrder.dateRequested)} />
          <div className="sm:col-span-2">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              To Do (Detailed Instructions)
            </p>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {taskOrder.todo}
            </div>
          </div>
        </div>

        {/* Update Form Section */}
        <div className="mt-8 border-t border-slate-200 pt-8">
          <h3 className="mb-6 text-xl font-bold text-slate-900">
            Update Task Status
          </h3>
          <PortalUpdateForm 
            taskOrder={taskOrder} 
            onSuccess={() => router.push("/orders")} 
          />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}