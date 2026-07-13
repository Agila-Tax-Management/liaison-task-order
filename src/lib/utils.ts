import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTaskOrderNumber(year: number, sequence: number): string {
  const seqStr = sequence.toString().padStart(3, "0");
  return `TO-${year}-${seqStr}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function serializeTaskOrder<T extends { dateRequested: Date; createdAt: Date; updatedAt: Date }>(
  taskOrder: T
): Omit<T, "dateRequested" | "createdAt" | "updatedAt"> & {
  dateRequested: string;
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...taskOrder,
    dateRequested: taskOrder.dateRequested.toISOString(),
    createdAt: taskOrder.createdAt.toISOString(),
    updatedAt: taskOrder.updatedAt.toISOString(),
  };
}