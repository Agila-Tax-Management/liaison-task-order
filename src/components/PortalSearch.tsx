"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function PortalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
        const data = await res.json();
        // Navigate to the task detail page
        router.push(`/portal/${data.taskOrderNumber}`);
      } catch {
        setError("Network error. Please try again.");
      }
    });
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
    </div>
  );
}