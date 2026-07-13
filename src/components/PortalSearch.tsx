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

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <div className="card p-6 sm:p-8">
        <h2 className="mb-1 text-xl font-bold text-navy-900">
          Search Task Order
        </h2>
        <p className="mb-5 text-sm text-slate-500">
          Enter the Task Order Number (e.g. <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-navy-700">TO-2026-0001</code>)
        </p>

        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="TO-2026-XXXX"
              className="input-field font-mono"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn-primary sm:w-auto"
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
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Task Order Details */}
      {taskOrder && (
        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 bg-linear-to-r from-navy-700 to-navy-800 px-6 py-5 text-white">
            <p className="text-xs font-medium uppercase tracking-wider text-navy-200">
              Task Order Found
            </p>
            <p className="mt-1 font-display text-2xl font-bold tracking-wide">
              {taskOrder.taskOrderNumber}
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <DetailRow label="Client Name" value={taskOrder.clientName} />
            <DetailRow label="Location" value={taskOrder.location} />
            <DetailRow label="Task Name" value={taskOrder.taskName} />
            <DetailRow label="Requested By" value={taskOrder.requestedBy} />
            <DetailRow
              label="Date Requested"
              value={formatDate(taskOrder.dateRequested)}
              className="sm:col-span-2"
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

          <div className="border-t border-slate-200 bg-slate-50 p-6">
            <PortalUpdateForm taskOrder={taskOrder} />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}