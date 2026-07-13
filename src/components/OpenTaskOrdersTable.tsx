"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { TaskOrderSerialized } from "@/types";
import { formatDate } from "@/lib/utils";
import { deleteTaskOrder } from "@/app/actions/task-order.actions";

interface OpenTaskOrdersTableProps {
  taskOrders: TaskOrderSerialized[];
  onTaskClick: (task: TaskOrderSerialized) => void;
}

export function OpenTaskOrdersTable({ taskOrders, onTaskClick }: OpenTaskOrdersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  function handleDelete(e: React.MouseEvent, id: number, taskOrderNumber: string) {
    e.stopPropagation();
    if (confirm(`Are you sure you want to permanently delete ${taskOrderNumber}?`)) {
      startTransition(async () => {
        const result = await deleteTaskOrder(id);
        if (result.success) {
          router.refresh();
        } else {
          alert(result.message || "Failed to delete.");
        }
      });
    }
  }

  function handleCopy(e: React.MouseEvent, id: number, taskOrderNumber: string) {
    e.stopPropagation(); // Prevents opening the modal when clicking copy
    navigator.clipboard.writeText(taskOrderNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset icon after 2 seconds
  }

  if (taskOrders.length === 0) {
    return (
      <div className="card p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">No open task orders at this time.</p>
        <p className="mt-1 text-xs text-slate-400">All task orders have been completed.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Task Order #</th>
              <th className="px-4 py-3 font-semibold">Client Name</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Task Name</th>
              <th className="px-4 py-3 font-semibold">Requested By</th>
              <th className="px-4 py-3 font-semibold">Date Requested</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {taskOrders.map((task) => (
              <tr
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="cursor-pointer transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-md bg-blue-50 px-2 py-1 font-mono text-xs font-bold text-blue-800">
                      {task.taskOrderNumber}
                    </span>
                    <button
                      onClick={(e) => handleCopy(e, task.id, task.taskOrderNumber)}
                      className="rounded p-1 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title={copiedId === task.id ? "Copied!" : "Copy Task Order Number"}
                    >
                      {copiedId === task.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{task.clientName}</td>
                <td className="px-4 py-3 text-slate-600">{task.location}</td>
                <td className="px-4 py-3 text-slate-700">{task.taskName}</td>
                <td className="px-4 py-3 text-slate-700">{task.requestedBy}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(task.dateRequested)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => handleDelete(e, task.id, task.taskOrderNumber)}
                    disabled={isPending}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    title="Delete Task Order"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}