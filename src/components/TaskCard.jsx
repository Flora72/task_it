import React, { useState } from "react";
import { Check, Calendar, Edit2, Trash2, Lock, Unlock, Pin } from "lucide-react";

export default function TaskCard({
  task,
  onToggleStatus,
  onTogglePin,
  onEdit,
  onDelete,
  onToggleLockModal,
}) {
  const [temporarilyRevealed, setTemporarilyRevealed] = useState(false);
  const [pinAttempt, setPinAttempt] = useState("");
  const [pinError, setPinError] = useState(false);

  const isCompleted = task.status === "completed";
  const isLocked = Boolean(task.isLocked) && !temporarilyRevealed;
  const spineColor = task.customHex || "#71717a";

  const priorityBadges = {
    high: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    medium: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
    low: "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800",
  };

  const handleQuickReveal = (e) => {
    e.preventDefault();
    if (pinAttempt === task.lockPin) {
      setTemporarilyRevealed(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinAttempt("");
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-xl overflow-hidden note-card-shadow transition-all duration-150 flex flex-col justify-between ${
        isCompleted ? "opacity-60 bg-zinc-50 dark:bg-zinc-900/40" : ""
      }`}
    >
      {/*  Hex Color Spine */}
      <div className="h-1 w-full" style={{ backgroundColor: spineColor }} />

      {/* Cover Image attachment */}
      {task.coverImage && (
        <div className="w-full h-28 overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
          <img
            src={task.coverImage}
            alt="Note Attachment"
            className={`w-full h-full object-cover transition duration-200 ${isLocked ? "blur-md scale-105" : ""}`}
          />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <button
                onClick={() => onToggleStatus(task)}
                aria-label={isCompleted ? "Mark pending" : "Mark completed"}
                className={`mt-0.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center transition shrink-0 ${
                  isCompleted
                    ? "bg-zinc-800 dark:bg-zinc-200 border-zinc-800 dark:border-zinc-200 text-white dark:text-zinc-900"
                    : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 bg-white dark:bg-zinc-800"
                }`}
              >
                {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm leading-snug break-words ${
                      isCompleted ? "line-through text-zinc-400 dark:text-zinc-500" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.isPinned && (
                    <Pin className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0 fill-current" />
                  )}
                  {task.isLocked && (
                    <Lock className="w-3 h-3 text-zinc-400 shrink-0" title="Locked Note" />
                  )}
                </div>
              </div>
            </div>

            {task.priority && task.priority !== "medium" && (
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                  priorityBadges[task.priority] || priorityBadges.medium
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>

          {/* Locked Privacy Block */}
          {isLocked ? (
            <div className="my-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-center">
              <Lock className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
              <p className="text-[10px] text-zinc-500 font-medium mb-2">PIN Protected</p>
              <form onSubmit={handleQuickReveal} className="flex justify-center gap-1.5">
                <input
                  type="password"
                  maxLength="4"
                  placeholder="PIN"
                  value={pinAttempt}
                  onChange={(e) => setPinAttempt(e.target.value)}
                  className={`w-16 px-2 py-1 text-center text-xs rounded border bg-white dark:bg-zinc-900 ${
                    pinError ? "border-rose-500" : "border-zinc-300 dark:border-zinc-700"
                  }`}
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded text-[10px] font-semibold"
                >
                  View
                </button>
              </form>
            </div>
          ) : (
            task.description && (
              <p
                className={`mt-2 text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap line-clamp-4 leading-relaxed pl-6 ${
                  isCompleted ? "line-through text-zinc-400 dark:text-zinc-600" : ""
                }`}
              >
                {task.description}
              </p>
            )
          )}

          {/* Tags */}
          {!isLocked && task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pl-6">
              {task.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            {task.dueDate ? (
              <>
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>{task.dueDate}</span>
              </>
            ) : (
              <span className="text-zinc-400 dark:text-zinc-600 italic">No due date</span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {/* Pin Toggle */}
            <button
              onClick={() => onTogglePin(task)}
              aria-label="Pin task"
              className={`p-1 rounded transition ${
                task.isPinned ? "text-amber-600 dark:text-amber-400" : "text-zinc-400 hover:text-zinc-600"
              }`}
              title={task.isPinned ? "Unpin note" : "Pin note to top"}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>

            {/* Lock/Unlock */}
            <button
              onClick={() => onToggleLockModal(task)}
              aria-label="Toggle lock"
              className={`p-1 rounded transition ${
                task.isLocked
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
              title={task.isLocked ? "Manage Lock / Unlock" : "Lock Note"}
            >
              {task.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(task)}
              aria-label="Edit task"
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300 transition"
              title="Edit Note"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(task)}
              aria-label="Delete task"
              className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-zinc-400 hover:text-rose-600 transition"
              title="Delete Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}