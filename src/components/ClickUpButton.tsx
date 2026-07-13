"use client";

import { useState, useTransition } from "react";

interface ClickUpButtonProps {
  id: number;
  clickupUpdated: boolean;
}

export function ClickUpButton({ id, clickupUpdated: initial }: ClickUpButtonProps) {
  const [updated, setUpdated] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (updated || isPending) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/task-orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clickupUpdated: true }),
        });
        if (res.ok) {
          setUpdated(true);
        } else {
          alert("Failed to update ClickUp status.");
        }
      } catch {
        alert("Network error. Please try again.");
      }
    });
  }

  if (updated) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex cursor-default items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Click Up Updated
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700 ring-1 ring-inset ring-orange-200 transition-all hover:bg-orange-500 hover:text-white disabled:opacity-60"
    >
      {isPending ? (
        <>
          <svg
            className="h-3.5 w-3.5 animate-spin"
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
          Updating...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Updated in Click Up
        </>
      )}
    </button>
  );
}