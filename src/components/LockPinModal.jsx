import React, { useState, useEffect } from "react";
import { Lock, Unlock, X, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function LockPinModal({ isOpen, onClose, onSaveLock, task }) {
  const { theme } = useTheme();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPin("");
    setError("");
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const isCurrentlyLocked = Boolean(task.isLocked);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!pin.trim() || pin.length < 4) {
      setError("Please enter a 4-digit PIN.");
      return;
    }

    if (isCurrentlyLocked) {
      // Verifying PIN to unlock / remove lock
      if (pin === task.lockPin) {
        onSaveLock(task.id, { isLocked: false, lockPin: null });
        onClose();
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
    } else {
      // Setting a new lock
      onSaveLock(task.id, { isLocked: true, lockPin: pin });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 text-center text-xs">
        {/* Header Icon */}
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center mx-auto mb-3">
          {isCurrentlyLocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </div>

        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          {isCurrentlyLocked ? "Unlock / Remove Note Lock" : "Lock This Note"}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-4">
          {isCurrentlyLocked
            ? `Enter the 4-digit PIN to remove the security lock on "${task.title}".`
            : `Set a 4-digit PIN to hide and protect the content of "${task.title}".`}
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            maxLength="4"
            autoFocus
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="w-36 mx-auto px-3 py-2 text-center text-base tracking-[0.4em] font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2 rounded-lg font-medium transition ${theme.button}`}
            >
              {isCurrentlyLocked ? "Unlock Note" : "Lock Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}