"use client";

import { useState, useTransition } from "react";
import type { TaskOrderSerialized } from "@/types";
import { STATUS_OPTIONS, type StatusOption } from "@/types";

interface PortalUpdateFormProps {
  taskOrder: TaskOrderSerialized;
  onSuccess?: () => void;
}

export function PortalUpdateForm({ taskOrder, onSuccess }: PortalUpdateFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);
  const [update, setUpdate] = useState("");
  const [whatsNext, setWhatsNext] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!selectedStatus) newErrors.taskStatus = "Please select a status";
    if (!update.trim()) newErrors.update = "Update is required";
    if (!whatsNext.trim()) newErrors.whatsNext = "What's Next is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("taskOrderNumber", taskOrder.taskOrderNumber);
        formData.set("taskStatus", selectedStatus!);
        formData.set("update", update);
        formData.set("whatsNext", whatsNext);

        const res = await fetch("/api/task-orders/update-status", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          setSubmitError(data.message || "Failed to update task order.");
          return;
        }

        setSuccess(true);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      } catch {
        setSubmitError("Network error. Please try again.");
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-emerald-900">
          Task Order Updated Successfully!
        </h3>
        <p className="mt-2 text-sm text-emerald-700">
          The status for <strong>{taskOrder.taskOrderNumber}</strong> has been updated.
        </p>
        <p className="mt-3 text-xs text-emerald-600">
          Closing...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Status Selection */}
      <div>
        <label className="label-text">
          Task Status <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {STATUS_OPTIONS.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-900 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="flex-1">{status}</span>
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0 text-blue-600 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        {errors.taskStatus && (
          <p className="mt-1 text-xs text-red-600">{errors.taskStatus}</p>
        )}
      </div>

      {/* Update Field */}
      <div>
        <label htmlFor="update" className="label-text">
          Update <span className="text-red-500">*</span>
        </label>
        <textarea
          id="update"
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          rows={4}
          className="input-field resize-none"
          placeholder="Describe what was done or the current status..."
        />
        {errors.update && (
          <p className="mt-1 text-xs text-red-600">{errors.update}</p>
        )}
      </div>

      {/* What's Next Field */}
      <div>
        <label htmlFor="whatsNext" className="label-text">
          What's Next <span className="text-red-500">*</span>
        </label>
        <textarea
          id="whatsNext"
          value={whatsNext}
          onChange={(e) => setWhatsNext(e.target.value)}
          rows={3}
          className="input-field resize-none"
          placeholder="Describe the next steps or actions required..."
        />
        {errors.whatsNext && (
          <p className="mt-1 text-xs text-red-600">{errors.whatsNext}</p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onSuccess}
          className="btn-secondary"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
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
              Submit Update
            </>
          )}
        </button>
      </div>
    </form>
  );
}