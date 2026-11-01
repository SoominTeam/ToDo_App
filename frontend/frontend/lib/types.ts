// اینترفیس Task - دقیقاً مطابق API Contract
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TODO'; // در اسپرینت ۱ فقط این مقدار
  createdAt: string; // ISO 8601 format
}

// محدودیت‌های اعتبارسنجی (مطابق PDF)
export const TASK_LIMITS = {
  TITLE_MIN: 1,
  TITLE_MAX: 100, // بعد از trim
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