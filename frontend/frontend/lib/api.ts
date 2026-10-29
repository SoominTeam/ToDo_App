import { Task } from './types';

// Mock Data - داده‌های نمونه برای توسعه مستقل از بک‌اند
let mockTasks: Task[] = [
  {
    id: '1',
    title: 'یادگیری Next.js',
    description: 'مطالعه مستندات و پیاده‌سازی پروژه نمونه',
    status: 'TODO',
    createdAt: '2026-10-28T10:30:00Z',
  },
  {
    id: '2',
    title: 'Complete Sprint 1',
    description: 'Finish all tasks for the first sprint',
    status: 'TODO',
    createdAt: '2026-10-27T14:20:00Z',
  },
];

// شبیه‌سازی تاخیر شبکه (برای تست Loading State)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * دریافت تمام وظایف (جدیدترین در ابتدا)
 * مطابق: GET /api/tasks -> 200 -> Task[]
 */
export async function getTasks(): Promise<Task[]> {
  await delay(800);
  
  // مرتب‌سازی بر اساس ID (صعودی) - قدیمی‌ترین اول
  return [...mockTasks].sort(
    (a, b) => parseInt(a.id) - parseInt(b.id)
  );
}

/**
 * ایجاد وظیفه جدید
 * مطابق: POST /api/tasks -> 201 -> Task
 */
// شمارنده برای تولید ID های متوالی
let nextId = 3; // چون ۲ وظیفه نمونه داریم

export async function createTask(
  title: string,
  description?: string
): Promise<Task> {
  await delay(600);
  
  const newTask: Task = {
    id: nextId.toString(),
    title: title.trim(),
    description: description?.trim() || undefined,
    status: 'TODO',
    createdAt: new Date().toISOString(),
  };
  
  nextId++;
  mockTasks.unshift(newTask);
  
  return newTask;
}