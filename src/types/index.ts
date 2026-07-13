export interface TaskOrder {
  id: number;
  taskOrderNumber: string;
  clientName: string;
  location: string;
  taskName: string;
  todo: string;
  requestedBy: string;
  dateRequested: Date;
  taskStatus: string | null;
  update: string | null;
  whatsNext: string | null;
  clickupUpdated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskOrderSerialized {
  id: number;
  taskOrderNumber: string;
  clientName: string;
  location: string;
  taskName: string;
  todo: string;
  requestedBy: string;
  dateRequested: string;
  taskStatus: string | null;
  update: string | null;
  whatsNext: string | null;
  clickupUpdated: boolean;
  createdAt: string;
  updatedAt: string;
}

// EXACTLY the 6 required statuses
export const STATUS_OPTIONS = [
  "Done, forwarded to CRT",
  "Next step - LT",
  "Lacking, forwarded to CRT (new requirement)",
  "Lacking, forwarded to CRT (CRT Error)",
  "Lacking, rescheduled (LT Error)",
  "Government Delay",
] as const;

export type StatusOption = (typeof STATUS_OPTIONS)[number];