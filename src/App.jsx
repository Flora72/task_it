import React, { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import AccountModal from "./components/AccountModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import LockPinModal from "./components/LockPinModal";
import ColorWheelPicker from "./components/ColorWheelPicker";
import {
  subscribeToUserTasks,
  createTask,
  updateTask,
  deleteTask,
  saveCloudBackup,
  getCloudBackupInfo,
} from "./services/taskService";
import {
  Plus,
  Moon,
  Sun,
  Search,
  LogOut,
  SlidersHorizontal,
  LayoutGrid,
  List,
  User,
  ArrowUpDown,
  Tag,
  Cloud,
  CloudCheck,
  FileDown,
  CheckCircle2,
} from "lucide-react";

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode, accentColor, setAccentColor, PRESET_PALETTES } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToLock, setTaskToLock] = useState(null);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  // Cloud backup state
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState(null);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setTaskToEdit(null);
        setIsModalOpen(true);
      } else if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);

    const unsubscribe = subscribeToUserTasks(
      currentUser.uid,
      (userTasks) => {
        setTasks(userTasks);
        setLoading(false);
      },
      (error) => {
        console.error("Task listener error:", error);
        setLoading(false);
      }
    );

    // Fetch previous cloud backup metadata
    getCloudBackupInfo(currentUser.uid).then((info) => {
      if (info?.lastSaved) {
        setLastBackupTime(new Date(info.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSaveTask = async (taskData) => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, taskData);
    } else {
      await createTask(currentUser.uid, taskData);
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    await updateTask(task.id, { status: nextStatus });
  };

  const handleTogglePin = async (task) => {
    await updateTask(task.id, { isPinned: !task.isPinned });
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleSaveLock = async (taskId, lockUpdates) => {
    await updateTask(taskId, lockUpdates);
  };

  // Online Cloud Backup to Firestore
  const handleCloudBackup = async () => {
    if (!currentUser || tasks.length === 0) return;
    try {
      setSyncingCloud(true);
      await saveCloudBackup(currentUser.uid, tasks);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastBackupTime(timeStr);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3000);
    } catch (err) {
      console.error("Backup failed:", err);
    } finally {
      setSyncingCloud(false);
    }
  };

  // Export Clean PDF Doc.
  const handleExportPDF = () => {
    window.print();
  };

  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags || [])));

  const filteredTasks = tasks
    .filter((task) => {
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesTag = selectedTag === "all" || (task.tags && task.tags.includes(selectedTag));
      const matchesSearch =
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === "due") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === "priority") {
        const pOrder = { high: 1, medium: 2, low: 3 };
        return (pOrder[a.priority] || 2) - (pOrder[b.priority] || 2);
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
      return timeB - timeA;
    });

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col pb-24 transition-colors">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
            <h1 className="text-base font-bold tracking-tight">Task It</h1>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 border-l border-zinc-200 dark:border-zinc-800 pl-3 hidden sm:inline">
              {currentUser?.displayName || currentUser?.email}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Online Cloud Sync Button */}
            <button
              type="button"
              onClick={handleCloudBackup}
              disabled={syncingCloud}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
              title="Backup workspace online to Cloud"
            >
              {syncingCloud ? (
                <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              ) : backupSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Cloud className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {syncingCloud ? "Backing up..." : backupSuccess ? "Backed up!" : "Online Backup"}
              </span>
            </button>

            {/* Color Palette Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPaletteMenu(!showPaletteMenu)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
                title="Customize Accent Color"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {showPaletteMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 z-50">
                  <ColorWheelPicker
                    selectedColor={accentColor}
                    onChangeColor={(hex) => setAccentColor(hex)}
                    presets={PRESET_PALETTES}
                  />
                </div>
              )}
            </div>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Account Settings */}
            <button
              type="button"
              onClick={() => setIsAccountOpen(true)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition cursor-pointer"
              title="Account Settings"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Workspace</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {completedCount} completed of {tasks.length} total notes
              {lastBackupTime && ` • Cloud synced at ${lastBackupTime}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Export PDF Button */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition cursor-pointer"
              title="Export workspace notes as PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-zinc-500" />
              <span>Export PDF</span>
            </button>

            {/* New Note Action */}
            <button
              type="button"
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
              style={{ backgroundColor: accentColor }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition hover:opacity-90 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Task 
            </button>
          </div>
        </div>

        {/* Toolbar: Filters, Search, Sorting */}
        <div className="space-y-3 mb-6 no-print">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Status Pills */}
            <div className="flex items-center gap-1 border-b sm:border-b-0 border-zinc-200 dark:border-zinc-800 pb-2 sm:pb-0 overflow-x-auto">
              {[
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "in_progress", label: "In Progress" },
                { id: "completed", label: "Done" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search, Sort, Layout */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search (Press /)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-600 dark:text-zinc-400">
                <ArrowUpDown className="w-3 h-3" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="due">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>

              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-white dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded cursor-pointer ${viewMode === "grid" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded cursor-pointer ${viewMode === "list" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
              <span className="text-zinc-400 shrink-0 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Tags:
              </span>
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className={`px-2 py-0.5 rounded-md border cursor-pointer ${
                  selectedTag === "all"
                    ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 border-transparent"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-0.5 rounded-md border cursor-pointer ${
                    selectedTag === tag
                      ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 border-transparent"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredTasks.length === 0 && (
          <div className="text-center py-20 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {searchQuery ? "No matching tasks found" : "No tasks yet"}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {searchQuery ? "Try another search term or filter." : "Create your first task note to begin."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setTaskToEdit(null);
                  setIsModalOpen(true);
                }}
                style={{ backgroundColor: accentColor }}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white transition hover:opacity-90 cursor-pointer"
              >
                Create Task
              </button>
            )}
          </div>
        )}

        {/* Notes Grid / List */}
        {!loading && filteredTasks.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-3 max-w-2xl"
            }
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                viewMode={viewMode}
                onToggleStatus={handleToggleStatus}
                onTogglePin={handleTogglePin}
                onEdit={(t) => {
                  setTaskToEdit(t);
                  setIsModalOpen(true);
                }}
                onDelete={(t) => setTaskToDelete(t)}
                onToggleLockModal={(t) => setTaskToLock(t)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        type="button"
        onClick={() => {
          setTaskToEdit(null);
          setIsModalOpen(true);
        }}
        style={{ backgroundColor: accentColor }}
        aria-label="Create note"
        className="fixed bottom-6 right-6 sm:hidden w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition active:scale-95 z-50 hover:opacity-90 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title}
      />

      <LockPinModal
        isOpen={Boolean(taskToLock)}
        onClose={() => setTaskToLock(null)}
        onSaveLock={handleSaveLock}
        task={taskToLock}
      />
    </div>
  );
}

export default function App() {
  const [viewState, setViewState] = useState("landing");

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootRouter viewState={viewState} setViewState={setViewState} />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootRouter({ viewState, setViewState }) {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Dashboard />;
  }

  if (viewState === "login" || viewState === "register") {
    return (
      <Auth
        initialMode={viewState}
        onBackToLanding={() => setViewState("landing")}
      />
    );
  }

  return (
    <LandingPage
      onOpenLogin={() => setViewState("login")}
      onOpenRegister={() => setViewState("register")}
      onGetStarted={() => setViewState("register")}
    />
  );
}