import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, AlertCircle, Pin } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ColorWheelPicker from "./ColorWheelPicker";

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const { accentColor, PRESET_PALETTES } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [customHex, setCustomHex] = useState(accentColor);
  const [isPinned, setIsPinned] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || "pending");
      setPriority(taskToEdit.priority || "medium");
      setDueDate(taskToEdit.dueDate || "");
      setCustomHex(taskToEdit.customHex || accentColor);
      setIsPinned(Boolean(taskToEdit.isPinned));
      setTags(taskToEdit.tags || []);
      setCoverImage(taskToEdit.coverImage || null);
    } else {
      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("medium");
      setDueDate("");
      setCustomHex(accentColor);
      setIsPinned(false);
      setTags([]);
      setCoverImage(null);
    }
    setError("");
    setTagInput("");
  }, [taskToEdit, isOpen, accentColor]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Please choose an image smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setCoverImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, "");
      if (clean && !tags.includes(clean) && tags.length < 5) {
        setTags([...tags, clean]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (t) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a title.");
      return;
    }

    try {
      setSubmitting(true);
      await onSave({
        title,
        description,
        status,
        priority,
        dueDate,
        customHex,
        isPinned,
        tags,
        coverImage,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Unable to save note.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header with Spine Indicator */}
        <div
          className="h-1.5 w-full transition-colors"
          style={{ backgroundColor: customHex }}
        />
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
              {taskToEdit ? "Edit Task Note" : "New Task Note"}
            </h2>
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1 rounded transition ${
                isPinned
                  ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
              title={isPinned ? "Unpin Note" : "Pin to Top"}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-lg border border-rose-200 dark:border-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {coverImage && (
            <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 max-h-36">
              <img src={coverImage} alt="Cover Attachment" className="w-full h-36 object-cover" />
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-900/70 text-white hover:bg-zinc-900 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div>
            <label className="block font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g, Report review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 transition"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Notes & Content
            </label>
            <textarea
              rows="3"
              placeholder="Write task details, ideas, or references..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Tags & Labels
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium flex items-center gap-1"
                >
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    <X className="w-2.5 h-2.5 text-zinc-400 hover:text-zinc-600" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Done</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
              />
            </div>
          </div>

          {/* Color Wheel & Custom Photo Attachment */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <ColorWheelPicker
              selectedColor={customHex}
              onChangeColor={(hex) => setCustomHex(hex)}
              presets={PRESET_PALETTES}
            />

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">Attach cover photo from device:</span>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium transition">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{coverImage ? "Change Picture" : "Choose File"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Footer Save Actions */}
          <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: customHex }}
              className="px-5 py-2 font-medium text-white rounded-lg transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Saving..." : taskToEdit ? "Update Note" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}