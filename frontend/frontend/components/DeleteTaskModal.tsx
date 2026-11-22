"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/lib/api";
import { Task } from "@/lib/types";
import MixedFontText from "@/components/MixedFontText";

interface DeleteTaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export default function DeleteTaskModal({
  task,
  onClose,
}: DeleteTaskModalProps) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
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
      return deleteTask(task.id);
    },
    onSuccess: () => {
      if (!task) return;
      queryClient.setQueryData(["tasks"], (old: Task[] | undefined) => {
        if (!old) return old;
        return old.filter((t) => t.id !== task.id);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon & Heading */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-error/15 text-error flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
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
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">
              {t("task.delete.heading")}
            </h3>
          </div>
        </div>

        {/* Message and Task Title Preview */}
        <p className="text-sm text-text-muted mb-3 leading-relaxed">
          {t("task.delete.message")}
        </p>

        <div className="bg-background border border-border rounded-lg p-3 mb-5">
          <p className="text-xs text-text-muted mb-1 font-medium">
            {t("task.form.title")}:
          </p>
          <div className="text-sm font-semibold text-text truncate">
            <MixedFontText text={task.title} />
          </div>
        </div>

        {error && (
          <div
            className="bg-error/10 border border-error text-error px-4 py-2.5 rounded-lg text-sm mb-4 flex items-center gap-2"
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

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded-lg border border-border text-text hover:bg-background transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            {t("task.delete.cancel")}
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="px-5 py-2 rounded-lg bg-error text-white hover:opacity-90 active:scale-95 transition-all text-sm font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
                <span>{t("task.delete.deleting")}</span>
              </>
            ) : (
              <span>{t("task.delete.confirm")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
