"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/lib/api";
import { TASK_LIMITS, Task } from "@/lib/types";

interface EditTaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export default function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setError("");
    }
  }, [task]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const mutation = useMutation({
    mutationFn: () => {
      if (!task) throw new Error("No task");
      return updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
      });
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["tasks"], (old: Task[] | undefined) => {
        if (!old) return old;
        const taskWithNewDate: Task = {
          ...updatedTask,
          createdAt: updatedTask.createdAt || new Date().toISOString(),
        };
        // Update in-place so the edited task keeps its row position and ID order
        return old.map((t) =>
          t.id === taskWithNewDate.id ? taskWithNewDate : t,
        );
      });
      onClose();
    },
    onError: (err: unknown) => {
      const errorObj = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const code =
        errorObj?.response?.data?.error || errorObj?.message || "SERVER_ERROR";
      const translatedMessage = t.raw(`errors.${code}`);
      const errorMessage =
        typeof translatedMessage === "string"
          ? translatedMessage
          : t("errors.UNKNOWN");
      setError(errorMessage);

      if (code === "TASK_NOT_FOUND") {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    },
  });

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      setError(t("errors.TITLE_REQUIRED"));
      return;
    }

    if (trimmedTitle.length > TASK_LIMITS.TITLE_MAX) {
      setError(t("errors.TITLE_TOO_LONG"));
      return;
    }

    if (trimmedDesc.length > TASK_LIMITS.DESCRIPTION_MAX) {
      setError(t("errors.INVALID_INPUT"));
      return;
    }

    mutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-text flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            {t("task.edit.heading")}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-primary-soft transition-colors cursor-pointer"
            aria-label={t("task.edit.close")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="edit-title"
                className="block text-sm font-medium text-text"
              >
                {t("task.form.title")} <span className="text-error">*</span>
              </label>
              <span className="text-xs text-text-muted">
                {title.length}/{TASK_LIMITS.TITLE_MAX}
              </span>
            </div>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("task.form.titlePlaceholder")}
              dir="auto"
              maxLength={TASK_LIMITS.TITLE_MAX}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              disabled={mutation.isPending}
              autoFocus
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium text-text"
              >
                {t("task.form.description")}
              </label>
              <span className="text-xs text-text-muted">
                {description.length}/{TASK_LIMITS.DESCRIPTION_MAX}
              </span>
            </div>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("task.form.descriptionPlaceholder")}
              dir="auto"
              rows={4}
              maxLength={TASK_LIMITS.DESCRIPTION_MAX}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              disabled={mutation.isPending}
            />
          </div>

          {error && (
            <div
              className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm flex items-center gap-2"
              dir="auto"
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
                className="rtl:rotate-180 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-lg border border-border text-text hover:bg-background transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
            >
              {t("task.edit.cancel")}
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-hover active:opacity-90 transition-colors text-sm font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                  <span>{t("task.edit.saving")}</span>
                </>
              ) : (
                <span>{t("task.edit.save")}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
