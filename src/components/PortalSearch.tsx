"use client";

import { useState, useTransition } from "react";
import type { TaskOrderSerialized } from "@/types";
import { formatDate } from "@/lib/utils";
import { PortalUpdateForm } from "./PortalUpdateForm";

export function PortalSearch() {
  const [query, setQuery] = useState("");
  const [taskOrder, setTaskOrder] = useState<TaskOrderSerialized | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTaskOrder(null);

    const trimmed = query.trim();
    if (!trimmed) {
      setError("Please enter a Task Order Number.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/task-orders/search?q=${encodeURIComponent(trimmed)}`
        );
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Task Order not found.");
          return;
        }
        const data: TaskOrderSerialized = await res.json();
        setTaskOrder(data);
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  function clearSearch() {
    setQuery("");
    setTaskOrder(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Search Task Order
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the Task Order Number (e.g.,{" "}
            <code className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-xs text-blue-700">
              TO-2026-001
            </code>
            )
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="TO-2026-XXX"
              className="input-field font-mono text-center sm:text-left"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn-primary sm:w-auto justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Task Order Details Modal */}
      {taskOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={clearSearch}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-slate-200 bg-linear-to-r from-blue-700 to-blue-900 px-6 py-5 text-white shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                    Task Order Found
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold tracking-wide">
                    {taskOrder.taskOrderNumber}
                  </p>
                  <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">
                    {taskOrder.taskName}
                  </h2>
                  {taskOrder.taskStatus && (
                    <div className="mt-3">
                      <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {taskOrder.taskStatus}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={clearSearch}
                  className="shrink-0 rounded-lg p-2 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Client Name" value={taskOrder.clientName} />
                <DetailRow label="Location" value={taskOrder.location} />
                <DetailRow label="Requested By" value={taskOrder.requestedBy} />
                <DetailRow
                  label="Date Requested"
                  value={formatDate(taskOrder.dateRequested)}
                />
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
              <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="mb-4 text-base font-bold text-slate-900">
                  Update Task Status
                </h3>
                <PortalUpdateForm taskOrder={taskOrder} onSuccess={clearSearch} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}