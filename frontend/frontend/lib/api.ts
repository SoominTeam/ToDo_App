import { Task } from './types';

const API_BASE_URL = 'http://localhost:4000/api/tasks';

/**
 * دریافت تمام وظایف (جدیدترین در ابتدا)
 */
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(API_BASE_URL);
  
  if (!res.ok) {
    throw new Error('SERVER_ERROR');
  }
  
  return res.json();
}

/**
 * ایجاد وظیفه جدید
 */
export async function createTask(
  title: string,
  description?: string
): Promise<Task> {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    // خطای بک‌اند رو پرتاب می‌کنیم تا AddTaskForm بتونه با TanStack Query بگیره
    throw { response: { data: errorData } }; 
  }

  return res.json();
}