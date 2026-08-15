import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, taskTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Delete Task ?
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-5">
          Are you sure you want to delete <span className="font-semibold text-zinc-700 dark:text-zinc-300">"{taskTitle}"</span>? This action cannot be undone.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
}