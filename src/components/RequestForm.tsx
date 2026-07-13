"use client";

import { useState, useTransition } from "react";
import { createTaskOrder } from "@/app/actions/task-order.actions";
import { SuccessDialog } from "./SuccessDialog";

interface RequestFormProps {
  onClose: () => void;
}

export function RequestForm({ onClose }: RequestFormProps) {
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

  // Show success dialog inside the modal context
  if (successNumber) {
    return <SuccessDialog taskOrderNumber={successNumber} onClose={onClose} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-200 bg-linear-to-r from-blue-700 to-blue-900 px-6 py-5 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                Create New Task Order
              </p>
              <h2 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                Request New Task Order
              </h2>
              <p className="mt-2 text-sm text-blue-100 opacity-90">
                Fill out the form below. The Task Order Number will be generated automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
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
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isPending}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="request-form" // Connects to the form above
            className="btn-primary" 
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
      </div>
    </div>
  );
}