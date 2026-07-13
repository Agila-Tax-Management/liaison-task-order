"use client";

import { useEffect } from "react";

interface SuccessDialogProps {
  taskOrderNumber: string;
  onClose: () => void;
}

export function SuccessDialog({ taskOrderNumber, onClose }: SuccessDialogProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Task Order Created Successfully!</h2>
        </div>

        <div className="px-6 py-8 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500">
            Your Task Order Number
          </p>
          <div className="mb-6 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/50 px-6 py-5">
            <p className="text-4xl font-bold tracking-wide text-navy-900 sm:text-5xl">
              {taskOrderNumber}
            </p>
          </div>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600">
            Please write down this Task Order Number together with the required
            documents for this task.
          </p>
        </div>

        <div className="flex justify-center border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}