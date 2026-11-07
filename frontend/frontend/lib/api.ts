import { Task } from "./types";

// آدرس بک‌اند از متغیر محیطی خوانده می‌شود (فایل .env.local در پوشه‌ی فرانت‌اند)
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");
const API_BASE_URL = `${API_URL}/api/tasks`;

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("SERVER_ERROR");
  return res.json();
}

export async function createTask(
  title: string,
  description?: string,
): Promise<Task> {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData } };
  }
  return res.json();
}

export async function updateTaskStatus(
  taskId: number,
  newStatus: "TODO" | "DONE" | "EXPIRED",
): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/${taskId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData } };
  }
  return res.json();
}
