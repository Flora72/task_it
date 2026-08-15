import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  X,
  User,
  Mail,
  Shield,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function AccountModal({ isOpen, onClose }) {
  const { currentUser, updateProfileDetails, updateAccountPassword, resetPassword } = useAuth();
  const { accentColor } = useTheme();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      setLoading(true);
      if (updateProfileDetails) {
        await updateProfileDetails({ displayName: displayName.trim() });
      }
      setSuccessMsg("Profile name updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile name.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      if (updateAccountPassword) {
        await updateAccountPassword(newPassword);
        setSuccessMsg("Password changed successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        await resetPassword(currentUser?.email);
        setSuccessMsg("A password reset email has been sent to your inbox.");
      }
    } catch (err) {
      setError(err.message || "Failed to update password. You may need to log in again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: accentColor }}
            >
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Account Settings
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Manage your credentials
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="mt-5 space-y-5 text-xs">
          {/* Email Info (Read-only) */}
          <div>
            <label className="block font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>{currentUser?.email || "No email"}</span>
            </div>
          </div>

          {/* Update Display Name */}
          <form onSubmit={handleUpdateName} className="space-y-2">
            <label className="block font-medium text-zinc-600 dark:text-zinc-400">
              Display Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: accentColor }}
                className="px-4 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>

          {/* Change Password */}
          <form onSubmit={handleUpdatePassword} className="space-y-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <label className="block font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min. 6 chars)"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-amber-400"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !newPassword}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition disabled:opacity-40 cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}