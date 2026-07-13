"use client";

import { useState, useTransition } from "react";
import { createTaskOrder } from "@/app/actions/task-order.actions";
import { SuccessDialog } from "./SuccessDialog";

export function RequestForm({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successNumber, setSuccessNumber] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function handleSubmit(formData: FormData) {
    setErrors({});
    setServerError(null);
    startTransition(async () => {
      const result = await createTaskOrder(formData);
      if (result.success && result.taskOrderNumber) {
        setSuccessNumber(result.taskOrderNumber);
      } else if (result.errors) {
        setErrors(result.errors);
      } else if (result.message) {
        setServerError(result.message);
      }
    });
  }

  if (successNumber) {
    return <SuccessDialog taskOrderNumber={successNumber} onClose={onClose} />;
  }

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-900">
            Request New Task Order
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill out the form below. The Task Order Number will be generated
            automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="clientName" className="label-text">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              required
              className="input-field"
              placeholder="e.g. Department of Defense"
            />
            {errors.clientName && (
              <p className="mt-1 text-xs text-red-600">{errors.clientName}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="label-text">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              className="input-field"
              placeholder="e.g. Washington, D.C."
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600">{errors.location}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="taskName" className="label-text">
            Task Name <span className="text-red-500">*</span>
          </label>
          <input
            id="taskName"
            name="taskName"
            type="text"
            required
            className="input-field"
            placeholder="Brief title of the task"
          />
          {errors.taskName && (
            <p className="mt-1 text-xs text-red-600">{errors.taskName}</p>
          )}
        </div>

        <div>
          <label htmlFor="todo" className="label-text">
            To Do (Detailed Instructions) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="todo"
            name="todo"
            required
            rows={5}
            className="input-field resize-none"
            placeholder="Provide detailed instructions for this task..."
          />
          {errors.todo && (
            <p className="mt-1 text-xs text-red-600">{errors.todo}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="requestedBy" className="label-text">
              Requested By <span className="text-red-500">*</span>
            </label>
            <input
              id="requestedBy"
              name="requestedBy"
              type="text"
              required
              className="input-field"
              placeholder="Your name"
            />
            {errors.requestedBy && (
              <p className="mt-1 text-xs text-red-600">{errors.requestedBy}</p>
            )}
          </div>

          <div>
            <label htmlFor="dateRequested" className="label-text">
              Date Requested
            </label>
            <input
              id="dateRequested"
              name="dateRequested"
              type="text"
              value={today}
              readOnly
              className="input-field-readonly"
            />
            <p className="mt-1 text-xs text-slate-500">
              Automatically set to today's date.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isPending}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
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
                Submitting...
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Submit Task Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}