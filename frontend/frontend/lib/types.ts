// اینترفیس Task - دقیقاً مطابق API Contract
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'DONE' | 'EXPIRED'; // اضافه شدن DONE و EXPIRED
  createdAt: string;
}

// محدودیت‌های اعتبارسنجی (مطابق PDF)
export const TASK_LIMITS = {
  TITLE_MIN: 1,
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 500,
} as const;

// کدهای خطای API (مطابق PDF)
export const ERROR_CODES = {
  TITLE_REQUIRED: 'TITLE_REQUIRED',
  TITLE_TOO_LONG: 'TITLE_TOO_LONG',
  INVALID_INPUT: 'INVALID_INPUT',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// ترتیب چرخش وضعیت‌ها
export const STATUS_CYCLE: Array<'TODO' | 'DONE' | 'EXPIRED'> = [
  'TODO',
  'DONE',
  'EXPIRED',
];

// دریافت وضعیت بعدی در چرخه
export function getNextStatus(currentStatus: 'TODO' | 'DONE' | 'EXPIRED'): 'TODO' | 'DONE' | 'EXPIRED' {
  const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
  return STATUS_CYCLE[nextIndex];
}