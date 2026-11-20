"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface StatusDropdownProps {
  status: "TODO" | "DONE" | "EXPIRED";
  onSelect: (newStatus: "TODO" | "DONE" | "EXPIRED") => void;
  isPending?: boolean;
  disabled?: boolean;
}

export default function StatusDropdown({
  status,
  onSelect,
  isPending = false,
  disabled = false,
}: StatusDropdownProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (newStatus: "TODO" | "DONE" | "EXPIRED") => {
    setIsOpen(false);
    if (newStatus !== status) {
      onSelect(newStatus);
    }
  };

  const getStatusTriggerClasses = (s: "TODO" | "DONE" | "EXPIRED") => {
    switch (s) {
      case "TODO":
        return "bg-warning-bg text-warning border border-warning/30 hover:border-warning/60";
      case "DONE":
        return "bg-success-bg text-success border border-success/30 hover:border-success/60";
      case "EXPIRED":
        return "bg-error-bg text-error border border-error/30 hover:border-error/60";
      default:
        return "bg-warning-bg text-warning border border-warning/30";
    }
  };

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      {/* Trigger Button: Shows current status + chevron */}
      <button
        type="button"
        onClick={() => !disabled && !isPending && setIsOpen((prev) => !prev)}
        disabled={disabled || isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-all shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${getStatusTriggerClasses(status)}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{t(`task.status.${status}`)}</span>
        {isPending ? (
          <svg
            className="animate-spin h-3 w-3"
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
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 start-0 min-w-[170px] bg-[#1c1215] dark:bg-[#211619] border border-[#3a2a2e] rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
          {/* Line 1: Header (non-clickable, in white) */}
          <div className="px-3.5 py-2 text-xs font-semibold text-white border-b border-white/10 select-none cursor-default tracking-wide">
            {t("task.selectStatus")}
          </div>

          {/* Line 2: TODO (in yellow) */}
          <button
            type="button"
            onClick={() => handleSelect("TODO")}
            className="w-full text-start px-3.5 py-2 text-xs font-semibold text-warning hover:bg-warning/15 focus:bg-warning/15 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
              {t("task.status.TODO")}
            </span>
            {status === "TODO" && (
              <svg
                className="w-3.5 h-3.5 text-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>

          {/* Line 3: DONE (in green) */}
          <button
            type="button"
            onClick={() => handleSelect("DONE")}
            className="w-full text-start px-3.5 py-2 text-xs font-semibold text-success hover:bg-success/15 focus:bg-success/15 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
              {t("task.status.DONE")}
            </span>
            {status === "DONE" && (
              <svg
                className="w-3.5 h-3.5 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>

          {/* Line 4: EXPIRED (in red) */}
          <button
            type="button"
            onClick={() => handleSelect("EXPIRED")}
            className="w-full text-start px-3.5 py-2 text-xs font-semibold text-error hover:bg-error/15 focus:bg-error/15 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
              {t("task.status.EXPIRED")}
            </span>
            {status === "EXPIRED" && (
              <svg
                className="w-3.5 h-3.5 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
