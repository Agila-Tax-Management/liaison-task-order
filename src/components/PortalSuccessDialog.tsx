"use client";

interface PortalSuccessDialogProps {
  taskOrderNumber: string;
}

export function PortalSuccessDialog({ taskOrderNumber }: PortalSuccessDialogProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-lg">
      <div className="bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-6 text-center text-white">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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
        <h2 className="text-xl font-bold">Submission Confirmation</h2>
      </div>

      <div className="px-6 py-8 text-center">
        <p className="mb-3 text-base text-slate-700">
          The Task Order Status for the Task Number
        </p>
        <div className="mb-5 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/50 px-6 py-5">
          <p className="text-5xl font-bold tracking-wide text-navy-900 sm:text-6xl">
            {taskOrderNumber}
          </p>
        </div>
        <p className="text-base text-slate-700">has been updated.</p>

        <div className="mx-auto mt-6 max-w-md rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="text-left">
              <p className="text-sm font-semibold text-amber-900">
                Important Reminder
              </p>
              <p className="mt-1 text-sm leading-relaxed text-amber-800">
                Take a screenshot and send this to the Messenger Group Chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}