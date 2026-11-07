export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "TODO" | "DONE" | "EXPIRED";
  createdAt: string;
}

export const TASK_LIMITS = {
  TITLE_MIN: 1,
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 500,
} as const;

export const ERROR_CODES = {
  TITLE_REQUIRED: "TITLE_REQUIRED",
  TITLE_TOO_LONG: "TITLE_TOO_LONG",
  INVALID_INPUT: "INVALID_INPUT",
  TASK_NOT_FOUND: "TASK_NOT_FOUND",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const STATUS_CYCLE: Array<"TODO" | "DONE" | "EXPIRED"> = [
  "TODO",
  "DONE",
  "EXPIRED",
];

export function getNextStatus(
  currentStatus: "TODO" | "DONE" | "EXPIRED",
): "TODO" | "DONE" | "EXPIRED" {
  const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
  return STATUS_CYCLE[nextIndex];
}
