"use client";

import { useState, useTransition } from "react";
import type { TaskOrderSerialized, StatusOption } from "@/types";
import { updateTaskOrderStatus } from "@/app/actions/task-order.actions";
import { StatusSelector } from "./StatusSelector";
import { PortalSuccessDialog } from "./PortalSuccessDialog";

interface PortalUpdateFormProps {
  taskOrder: TaskOrderSerialized;
}

export function PortalUpdateForm({ taskOrder }: PortalUpdateFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successNumber, setSuccessNumber] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setErrors({});
    setServerError(null);

    if (!selectedStatus) {
      setErrors({ taskStatus: "Please select a status" });
      return;
    }

    formData.set("taskStatus", selectedStatus);
    formData.set("taskOrderNumber", taskOrder.taskOrderNumber);

    startTransition(async () => {
      const result = await updateTaskOrderStatus(formData);
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
    return <PortalSuccessDialog taskOrderNumber={successNumber} />;
  }

  return (
    <div>
      <h3 className="mb-4 text-base font-bold text-navy-900">
        Update Task Order Status
      </h3>

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

            <div className="flex justify-end border-t border-slate-200 pt-5">
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
                    Saving...
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
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
  );
}