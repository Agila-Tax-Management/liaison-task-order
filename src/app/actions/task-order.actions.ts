"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const requestSchema = {
  validate: (data: {
    clientName: string;
    location: string;
    taskName: string;
    todo: string;
    requestedBy: string;
  }) => {
    const errors: Record<string, string> = {};
    if (!data.clientName || data.clientName.trim().length === 0) {
      errors.clientName = "Client Name is required";
    }
    if (!data.location || data.location.trim().length === 0) {
      errors.location = "Location is required";
    }
    if (!data.taskName || data.taskName.trim().length === 0) {
      errors.taskName = "Task Name is required";
    }
    if (!data.todo || data.todo.trim().length === 0) {
      errors.todo = "To Do is required";
    }
    if (!data.requestedBy || data.requestedBy.trim().length === 0) {
      errors.requestedBy = "Requested By is required";
    }
    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export async function generateNextTaskOrderNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `TO-${currentYear}-`;

  const latest = await prisma.taskOrder.findFirst({
    where: {
      taskOrderNumber: {
        startsWith: yearPrefix,
      },
    },
    orderBy: {
      taskOrderNumber: "desc",
    },
    select: {
      taskOrderNumber: true,
    },
  });

  let nextSequence = 1;
  if (latest) {
    const parts = latest.taskOrderNumber.split("-");
    const lastSeq = parseInt(parts[2], 10);
    if (!isNaN(lastSeq)) {
      nextSequence = lastSeq + 1;
    }
  }

  const seqStr = nextSequence.toString().padStart(3, "0");
  return `${yearPrefix}${seqStr}`;
}

export interface CreateTaskOrderResult {
  success: boolean;
  taskOrderNumber?: string;
  errors?: Record<string, string>;
  message?: string;
}

export interface UpdateTaskOrderStatusResult {
  success: boolean;
  taskOrderNumber?: string;
  errors?: Record<string, string>;
  message?: string;
}

export async function createTaskOrder(
  formData: FormData
): Promise<CreateTaskOrderResult> {
  try {
    const data = {
      clientName: String(formData.get("clientName") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      taskName: String(formData.get("taskName") ?? "").trim(),
      todo: String(formData.get("todo") ?? "").trim(),
      requestedBy: String(formData.get("requestedBy") ?? "").trim(),
    };

    const validation = requestSchema.validate(data);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    const taskOrder = await prisma.$transaction(async (tx) => {
      const currentYear = new Date().getFullYear();
      const yearPrefix = `TO-${currentYear}-`;

      const latest = await tx.taskOrder.findFirst({
        where: {
          taskOrderNumber: { startsWith: yearPrefix },
        },
        orderBy: { taskOrderNumber: "desc" },
        select: { taskOrderNumber: true },
      });

      let nextSequence = 1;
      if (latest) {
        const parts = latest.taskOrderNumber.split("-");
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) nextSequence = lastSeq + 1;
      }

      const seqStr = nextSequence.toString().padStart(3, "0");
      const taskOrderNumber = `${yearPrefix}${seqStr}`;

      return tx.taskOrder.create({
        data: {
          taskOrderNumber,
          clientName: data.clientName,
          location: data.location,
          taskName: data.taskName,
          todo: data.todo,
          requestedBy: data.requestedBy,
          dateRequested: new Date(),
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/portal");

    return {
      success: true,
      taskOrderNumber: taskOrder.taskOrderNumber,
    };
  } catch (error) {
    console.error("Error creating task order:", error);
    return {
      success: false,
      message: "Failed to create task order. Please try again.",
    };
  }
}

export async function updateTaskOrderStatus(
  formData: FormData
): Promise<UpdateTaskOrderStatusResult> {
  try {
    const taskOrderNumber = String(formData.get("taskOrderNumber") ?? "").trim();
    const taskStatus = String(formData.get("taskStatus") ?? "").trim();
    const update = String(formData.get("update") ?? "").trim();
    const whatsNext = String(formData.get("whatsNext") ?? "").trim();

    const errors: Record<string, string> = {};

    if (!taskOrderNumber) errors.taskOrderNumber = "Task Order Number is required";
    if (!taskStatus) errors.taskStatus = "Please select a status";
    if (!update) errors.update = "Update is required";
    if (!whatsNext) errors.whatsNext = "What's Next is required";

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const existing = await prisma.taskOrder.findUnique({
      where: { taskOrderNumber },
    });

    if (!existing) {
      return {
        success: false,
        message: `Task Order ${taskOrderNumber} not found.`,
      };
    }

    const updated = await prisma.taskOrder.update({
      where: { taskOrderNumber },
      data: {
        taskStatus,
        update,
        whatsNext,
      },
    });

    revalidatePath("/");
    revalidatePath("/portal");

    return {
      success: true,
      taskOrderNumber: updated.taskOrderNumber,
    };
  } catch (error) {
    console.error("Error updating task order status:", error);
    return {
      success: false,
      message: "Failed to update task order. Please try again.",
    };
  }
}

export async function deleteTaskOrder(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    await prisma.taskOrder.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/portal");

    return { success: true };
  } catch (error) {
    console.error("Error deleting task order:", error);
    return { success: false, message: "Failed to delete task order." };
  }
}