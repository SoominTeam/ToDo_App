"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { getTasks, updateTaskStatus } from "@/lib/api";
import type { Task } from "@/lib/types";
import MixedFontText from "@/components/MixedFontText";
import StatusDropdown from "@/components/StatusDropdown";
import EditTaskModal from "@/components/EditTaskModal";
import DeleteTaskModal from "@/components/DeleteTaskModal";

export default function TaskList() {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [statusError, setStatusError] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const fetchedTasks = await getTasks();
      // Sort by ID descending so edited tasks keep their position across refreshes
      return [...fetchedTasks].sort((a, b) => b.id - a.id);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      taskId,
      newStatus,
    }: {
      taskId: number;
      newStatus: "TODO" | "DONE" | "EXPIRED";
    }) => updateTaskStatus(taskId, newStatus),
    onSuccess: (updatedTask) => {
      setStatusError("");
      queryClient.setQueryData(["tasks"], (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        );
      });
    },
    onError: (err: unknown) => {
      const errorObj = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const code =
        errorObj?.response?.data?.error || errorObj?.message || "SERVER_ERROR";
      setStatusError(
        t.has(`errors.${code}`) ? t(`errors.${code}`) : t("errors.UNKNOWN"),
      );

      if (code === "TASK_NOT_FOUND") {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    },
  });

  const handleStatusSelect = (
    task: Task,
    newStatus: "TODO" | "DONE" | "EXPIRED",
  ) => {
    if (updateStatusMutation.isPending) return;
    if (task.status === newStatus) return;
    setStatusError("");
    updateStatusMutation.mutate({
      taskId: task.id,
      newStatus,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-text mb-4">
          {t("task.list.heading")}
        </h2>
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ms-3 text-text-muted">{t("task.list.loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-text mb-4">
          {t("task.list.heading")}
        </h2>
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-center">
          {t("task.list.error")}
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-text mb-4">
          {t("task.list.headingWithCount", { count: formatNumber(0) })}
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-text-muted text-lg">{t("task.list.empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-text mb-4">
        {t("task.list.headingWithCount", { count: formatNumber(tasks.length) })}
      </h2>

      {statusError && (
        <div
          className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm mb-4"
          dir="auto"
          role="alert"
        >
          {statusError}
        </div>
      )}

      <div className="overflow-x-auto min-h-[220px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">
                {t("task.columns.id")}
              </th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">
                {t("task.columns.title")}
              </th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">
                {t("task.columns.description")}
              </th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">
                {t("task.columns.status")}
              </th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">
                {t("task.columns.createdAt")}
              </th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">
                {t("task.columns.edit")}
              </th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">
                {t("task.columns.delete")}
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: Task, index: number) => (
              <tr
                key={task.id}
                className="border-b border-border hover:bg-primary-soft/50 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-text">
                  {formatNumber(tasks.length - index)}
                </td>

                <td className="py-3 px-4 text-sm font-medium text-text">
                  <div className="flex justify-start w-full">
                    <MixedFontText text={task.title} />
                  </div>
                </td>

                <td className="py-3 px-4 text-sm text-text-muted">
                  <div className="flex justify-start w-full">
                    <MixedFontText
                      text={task.description || t("task.noDescription")}
                    />
                  </div>
                </td>

                <td className="py-3 px-4">
                  <StatusDropdown
                    status={task.status}
                    onSelect={(newStatus) => handleStatusSelect(task, newStatus)}
                    isPending={
                      updateStatusMutation.isPending &&
                      (updateStatusMutation.variables as { taskId: number; newStatus: "TODO" | "DONE" | "EXPIRED" } | undefined)?.taskId === task.id
                    }
                  />
                </td>

                <td className="py-3 px-4 text-sm text-text-muted">
                  {formatDate(task.createdAt)}
                </td>

                <td className="py-3 px-4 text-start">
                  <button
                    type="button"
                    onClick={() => setEditingTask(task)}
                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary-soft rounded-lg transition-colors cursor-pointer"
                    title={t("task.edit.buttonTooltip")}
                    aria-label={t("task.edit.buttonTooltip")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                </td>

                <td className="py-3 px-4 text-start">
                  <button
                    type="button"
                    onClick={() => setDeletingTask(task)}
                    className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    title={t("task.delete.buttonTooltip")}
                    aria-label={t("task.delete.buttonTooltip")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {deletingTask && (
        <DeleteTaskModal
          task={deletingTask}
          onClose={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}
