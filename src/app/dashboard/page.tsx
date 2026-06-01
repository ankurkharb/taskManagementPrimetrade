"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type ToastType = { message: string; type: "success" | "error" } | null;

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastType>(null);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [formStatus, setFormStatus] = useState<"PENDING" | "IN_PROGRESS" | "DONE">("PENDING");
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (filterStatus) params.set("status", filterStatus);
      if (filterPriority) params.set("priority", filterPriority);
      const res = await fetch(`/api/v1/tasks?${params}`);
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
        setPagination(data.pagination);
      }
    } catch {
      showToast("Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingTask ? `/api/v1/tasks/${editingTask.id}` : "/api/v1/tasks";
      const method = editingTask ? "PUT" : "POST";
      const body: Record<string, string | undefined> = {
        title: formTitle,
        description: formDescription || undefined,
        priority: formPriority,
      };
      if (editingTask) body.status = formStatus;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingTask ? "Task updated!" : "Task created!", "success");
        closeForm();
        fetchTasks();
      } else {
        showToast("Operation failed", "error");
      }
    } catch {
      showToast("Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/v1/tasks/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Task deleted", "success");
        fetchTasks();
      } else {
        showToast("Delete failed", "error");
      }
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description || "");
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormTitle("");
    setFormDescription("");
    setFormPriority("MEDIUM");
    setFormStatus("PENDING");
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return "neo-badge-pending";
      case "IN_PROGRESS": return "neo-badge-progress";
      case "DONE": return "neo-badge-done";
      default: return "";
    }
  };

  const priorityBadge = (priority: string) => {
    switch (priority) {
      case "LOW": return "neo-badge-low";
      case "MEDIUM": return "neo-badge-medium";
      case "HIGH": return "neo-badge-high";
      default: return "";
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-label animate-pulse">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-28">
      {/* Top Bar */}
      <header className="neo-topbar">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 border-[3px] border-black bg-nb-primary-container flex items-center justify-center neo-shadow-sm">
              <span className="font-headline font-bold text-sm">P</span>
            </div>
          </Link>
          <span className="font-headline font-bold text-lg tracking-tight uppercase hidden sm:block">
            PrimeTrade
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-label text-[12px] opacity-60 hidden sm:block">
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
          <UserButton />
        </div>
      </header>

      <div className="pt-24 px-4 max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-8 animate-nb-fade-in">
          <div>
            <h1 className="text-display-mobile uppercase tracking-tight">
              My Tasks
            </h1>
            <p className="text-body opacity-60 mt-1">
              {pagination.total} task{pagination.total !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 mb-6 animate-nb-slide-up">
          <div className="flex-1 min-w-[140px]">
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="neo-select"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <select
              id="filter-priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="neo-select"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-label animate-pulse">Loading tasks...</div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 animate-nb-bounce-in">
            <div className="w-20 h-20 border-[3px] border-black bg-nb-primary-container mx-auto mb-4 flex items-center justify-center neo-shadow">
              <span className="material-symbols-outlined text-[40px]">checklist</span>
            </div>
            <h3 className="text-title mb-2 uppercase">No tasks yet</h3>
            <p className="text-body opacity-60 mb-6">
              Create your first task to get started
            </p>
            <button
              onClick={() => { setShowForm(true); setEditingTask(null); }}
              className="neo-btn neo-btn-primary neo-shadow neo-press"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Task
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="neo-card p-5 animate-nb-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-title flex-1 leading-snug">{task.title}</h3>
                    <div className="flex gap-1 shrink-0">
                      <button
                        id={`edit-task-${task.id}`}
                        onClick={() => startEdit(task)}
                        className="neo-btn neo-btn-ghost p-1"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        id={`delete-task-${task.id}`}
                        onClick={() => handleDelete(task.id)}
                        className="neo-btn neo-btn-ghost p-1"
                        style={{ color: "var(--color-nb-error)" }}
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-body opacity-70 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Badges & Date */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`neo-badge ${statusBadge(task.status)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    <span className={`neo-badge ${priorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-label text-[11px] opacity-40 ml-auto">
                      {formatDate(task.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  id="prev-page-btn"
                  onClick={() => fetchTasks(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="neo-btn neo-btn-surface neo-shadow-sm neo-press-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Prev
                </button>
                <div className="neo-badge bg-nb-surface-container-highest px-4 py-2">
                  {pagination.page} / {pagination.totalPages}
                </div>
                <button
                  id="next-page-btn"
                  onClick={() => fetchTasks(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="neo-btn neo-btn-surface neo-shadow-sm neo-press-sm"
                >
                  Next
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="neo-modal-overlay" onClick={closeForm}>
          <div className="neo-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-headline uppercase">
                {editingTask ? "Edit Task" : "New Task"}
              </h2>
              <button onClick={closeForm} className="neo-btn neo-btn-ghost p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-label block mb-1 px-1">Task Name</label>
                <input
                  id="task-title"
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="neo-input neo-input-title"
                  placeholder="e.g. Design API Schema"
                  required
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-label block mb-1 px-1">Description</label>
                <textarea
                  id="task-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="neo-input"
                  placeholder="Describe the task details..."
                  rows={3}
                  style={{ resize: "vertical", fontFamily: "Public Sans, sans-serif" }}
                />
              </div>

              {/* Priority Toggle */}
              <div>
                <label className="text-label block mb-1 px-1">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormPriority(p)}
                      className={`neo-btn neo-shadow-sm neo-press-sm text-[12px] py-3 ${
                        formPriority === p
                          ? p === "LOW"
                            ? "bg-nb-secondary-fixed"
                            : p === "MEDIUM"
                            ? "bg-nb-secondary-container"
                            : "bg-nb-primary-container"
                          : "neo-btn-surface"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status (edit only) */}
              {editingTask && (
                <div>
                  <label className="text-label block mb-1 px-1">Status</label>
                  <select
                    id="task-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "PENDING" | "IN_PROGRESS" | "DONE")}
                    className="neo-select"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="neo-btn neo-btn-primary neo-shadow-lg neo-press-lg w-full py-5"
                  style={{ fontSize: "18px" }}
                >
                  <span className="material-symbols-outlined">save</span>
                  {submitting
                    ? "Saving..."
                    : editingTask
                    ? "Save Changes"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`neo-toast ${toast.type === "success" ? "neo-toast-success" : "neo-toast-error"}`}>
          {toast.message}
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="neo-bottom-nav">
        <Link href="/" className="">
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </Link>
        <Link href="/dashboard" className="active">
          <span className="material-symbols-outlined">checklist</span>
          <span>Tasks</span>
        </Link>
        <button
          onClick={() => { setShowForm(true); setEditingTask(null); }}
          className=""
        >
          <span className="material-symbols-outlined">add_box</span>
          <span>Add</span>
        </button>
        <Link href="/docs" className="">
          <span className="material-symbols-outlined">description</span>
          <span>Docs</span>
        </Link>
      </nav>
    </main>
  );
}
