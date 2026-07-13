"use client";

import { STATUS_OPTIONS, type StatusOption } from "@/types";
import { cn } from "@/lib/utils";

interface StatusSelectorProps {
  selected: StatusOption | null;
  onSelect: (status: StatusOption) => void;
}

export function StatusSelector({ selected, onSelect }: StatusSelectorProps) {
  return (
    <div>
      <label className="label-text">
        Task Status <span className="text-red-500">*</span>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {STATUS_OPTIONS.map((status) => {
          const isSelected = selected === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onSelect(status)}
              className={cn(
                "flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                isSelected
                  ? "border-navy-600 bg-navy-50 text-navy-900 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <span className="flex-1">{status}</span>
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 text-navy-600 ml-2"
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
    </div>
  );
}