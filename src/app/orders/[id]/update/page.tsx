"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateTaskOrderStatus } from "@/app/actions/task-order.actions";
import { StatusSelector } from "@/components/StatusSelector";
import type { StatusOption } from "@/types";

interface UpdatePageProps {
  params: {
    id: string;
  };
  searchParams: {
    number: string;
    name: string;
    status?: string;
  };
}

export default function UpdateTaskOrderPage({ params, searchParams }: UpdatePageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const taskOrderNumber = searchParams.number;
  const taskName = searchParams.name;

  function handleSubmit(formData: FormData) {
    setErrors({});
    setServerError(null);

    if (!selectedStatus) {
      setErrors({ taskStatus: "Please select a status" });
      return;
    }

    formData.set("taskStatus", selectedStatus);
    formData.set("taskOrderNumber", taskOrderNumber);

    startTransition(async () => {
      const result = await updateTaskOrderStatus(formData);
      
      if (result.success && result.taskOrderNumber) {
        setSuccess(true);
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/orders");
        }, 2000);
      } else if (result.errors) {
        setErrors(result.errors);
      } else if (result.message) {
        setServerError(result.message);
      }
    });
  }

  if (success) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-emerald-900">
            Task Order Updated Successfully!
          </h2>
          <p className="mt-2 text-emerald-700">
            {taskOrderNumber} has been updated.
          </p>
          <p className="mt-4 text-sm text-emerald-600">
            Redirecting to Task Orders...
          </p>
          <Link href="/orders" className="mt-6 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium">
            Go to Task Orders
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
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
        <div className="rounded-xl border border-slate-200 bg-linear-to-r from-blue-700 to-blue-900 px-6 py-6 text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
            Task Order Found
          </p>
          <p className="mt-1 font-mono text-lg font-bold tracking-wide">
            {taskOrderNumber}
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
            {taskName}
          </h1>
          {searchParams.status && (
            <div className="mt-3">
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {searchParams.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Update Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Update Task Order Status
        </h2>

        {serverError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <StatusSelector
            selected={selectedStatus}
            onSelect={setSelectedStatus}
          />
          {errors.taskStatus && (
            <p className="-mt-3 text-xs text-red-600">{errors.taskStatus}</p>
          )}

          {selectedStatus && (
            <>
              <div>
                <label htmlFor="update" className="label-text">
                  Update <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="update"
                  name="update"
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Provide details about the update..."
                />
                {errors.update && (
                  <p className="mt-1 text-xs text-red-600">{errors.update}</p>
                )}
              </div>

              <div>
                <label htmlFor="whatsNext" className="label-text">
                  What's Next <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="whatsNext"
                  name="whatsNext"
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe the next steps..."
                />
                {errors.whatsNext && (
                  <p className="mt-1 text-xs text-red-600">{errors.whatsNext}</p>
                )}
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save Update
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}