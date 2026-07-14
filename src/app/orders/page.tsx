"use client";

import { useState } from "react";
import { createTaskOrder } from "@/app/actions/task-order.actions";
import { SuccessDialog } from "@/components/SuccessDialog";
import Link from "next/link";

export default function NewTaskOrderPage() {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successNumber, setSuccessNumber] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setErrors({});
    setServerError(null);

    const result = await createTaskOrder(formData);
    
    if (result.success && result.taskOrderNumber) {
      setSuccessNumber(result.taskOrderNumber);
    } else if (result.errors) {
      setErrors(result.errors);
    } else if (result.message) {
      setServerError(result.message);
    }
    
    setIsPending(false);
  }

  if (successNumber) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <SuccessDialog 
          taskOrderNumber={successNumber} 
          onClose={() => window.location.href = "/orders"} 
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/orders" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Task Orders
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent sm:text-4xl">
            Create New Task Order
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Fill out the form below. The Task Order Number will be generated automatically.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
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

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <Link href="/orders" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Task Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}