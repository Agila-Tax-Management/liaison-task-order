"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { TaskOrderSerialized } from "@/types";
import { formatDate } from "@/lib/utils";
import { deleteTaskOrder } from "@/app/actions/task-order.actions";

interface TaskOrderDetailModalProps {
  task: TaskOrderSerialized;
  onClose: () => void;
}

export function TaskOrderDetailModal({ task, onClose }: TaskOrderDetailModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm(`Are you sure you want to permanently delete ${task.taskOrderNumber}?`)) {
      startTransition(async () => {
        const result = await deleteTaskOrder(task.id);
        if (result.success) {
          router.refresh();
          onClose(); // Close the modal after successful deletion
        } else {
          alert(result.message || "Failed to delete.");
        }
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-200 bg-linear-to-r from-navy-700 to-navy-800 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-navy-200">
                Task Order Details
              </p>
              <p className="mt-1 font-display text-2xl font-bold tracking-wide">
                {task.taskOrderNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-navy-200 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Basic Information</h3>
            <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client Name</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{task.clientName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{task.location}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Task Name</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{task.taskName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Requested By</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{task.requestedBy}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date Requested</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{formatDate(task.dateRequested)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
                <p className="mt-1">
                  {task.taskStatus ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      {task.taskStatus}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">Open</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* To Do */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">To Do (Detailed Instructions)</h3>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {task.todo}
            </div>
          </div>

          {/* Update and What's Next (if available) */}
          {task.taskStatus && (
            <>
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Update</h3>
                <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {task.update || "No update provided."}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">What's Next</h3>
                <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {task.whatsNext || "No next steps provided."}
                </div>
              </div>
            </>
          )}

          {/* ClickUp Status */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">ClickUp Status</h3>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              {task.clickupUpdated ? (
                <div className="flex items-center gap-2 text-emerald-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Click Up Updated</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Not yet updated in ClickUp</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}