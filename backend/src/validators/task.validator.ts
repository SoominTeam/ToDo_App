import { z } from "zod";

export const TASK_STATUSES = ["TODO", "DONE", "EXPIRED"] as const;

export const createTaskSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "TITLE_REQUIRED" : "INVALID_INPUT",
    })
    .trim()
    .min(1, "TITLE_REQUIRED")
    .max(100, "TITLE_TOO_LONG"),
  description: z.string().max(500, "INVALID_INPUT").optional().default(""),
});

export const taskIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "INVALID_INPUT")
    .refine((value) => {
      const n = Number(value);
      return n >= 1 && n <= 2147483647;
    }, "INVALID_INPUT"),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(TASK_STATUSES, { error: "INVALID_INPUT" }),
});
