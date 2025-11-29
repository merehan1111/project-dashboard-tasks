"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProject,
  listTasks,
  addTask,
  updateTasksStatus,
  updateTask,
} from "@/lib/mockApi";
import RequireAuth from "@/components/auth/RequireAuth";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { useState, KeyboardEvent } from "react";
import type { Task } from "@/types";

interface Props {
  params: { id: string };
}

type TaskStatusFilter = Task["status"] | "All";

export default function ProjectDetailsPage({ params }: Props) {
  const { id } = params;
  const queryClient = useQueryClient();

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  // فلاتر التاسكات
  const [taskStatusFilter, setTaskStatusFilter] =
    useState<TaskStatusFilter>("All");
  const [taskSearch, setTaskSearch] = useState("");

  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    refetchInterval: 5000, 
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => listTasks(id),
    refetchInterval: 5000, 
  });

  const addTaskMutation = useMutation({
    mutationFn: () => addTask(id, newTaskTitle, newTaskAssignee),
    onSuccess: () => {
      setNewTaskTitle("");
      setNewTaskAssignee("");
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: (status: "Todo" | "In Progress" | "Done") =>
      updateTasksStatus(id, selectedTasks, status),
    onSuccess: () => {
      setSelectedTasks([]);
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (payload: {
      taskId: string;
      patch: Partial<Pick<Task, "title" | "assignee" | "status">>;
    }) => updateTask(id, payload.taskId, payload.patch),
    onMutate: async ({ taskId, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", id] });
      const prev = queryClient.getQueryData<Task[]>(["tasks", id]);
      if (prev) {
        queryClient.setQueryData<Task[]>(["tasks", id], prev.map((t) =>
          t.id === taskId ? { ...t, ...patch } : t
        ));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["tasks", id], ctx.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((x) => x !== taskId)
        : [...prev, taskId]
    );
  };

  const project = projectQuery.data;

  const filteredTasks: Task[] =
    tasksQuery.data?.filter((t) => {
      let ok = true;
      if (taskStatusFilter !== "All") {
        ok = ok && t.status === taskStatusFilter;
      }
      if (taskSearch.trim()) {
        const s = taskSearch.toLowerCase();
        ok =
          ok &&
          (t.title.toLowerCase().includes(s) ||
            t.assignee.toLowerCase().includes(s));
      }
      return ok;
    }) ?? [];

  const handleInlineEdit = (
    taskId: string,
    field: "title" | "assignee",
    value: string
  ) => {
    updateTaskMutation.mutate({ taskId, patch: { [field]: value } as any });
  };

  const handleInputKey = (
    e: KeyboardEvent<HTMLInputElement>,
    taskId: string,
    field: "title" | "assignee"
  ) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      handleInlineEdit(taskId, field, e.currentTarget.value);
    }
  };

  return (
    <RequireAuth>
      <MainLayout>
        <div className="space-y-6 text-slate-50">
          <Link
            href="/dashboard"
            className="text-xs text-cyan-300 hover:text-cyan-200 hover:underline"
          >
            ← Back to dashboard
          </Link>

          {projectQuery.isLoading ? (
            <div
              className="animate-pulse space-y-3"
              aria-busy="true"
              aria-label="Loading project details"
            >
              <div className="h-5 w-1/3 rounded bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-800" />
            </div>
          ) : project ? (
            <header className="space-y-1">
              <h1 className="text-2xl font-bold md:text-3xl">
                {project.name}
              </h1>
              <p className="text-sm text-slate-400">
                Status:{" "}
                <span className="text-slate-100">{project.status}</span> •
                Owner: <span className="text-slate-100">{project.owner}</span>
              </p>
            </header>
          ) : (
            <p className="text-sm text-red-400">Project not found.</p>
          )}

          {project && (
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                <h2 className="text-sm font-semibold text-slate-100">
                  Dates
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {project.startDate} → {project.endDate}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                <h2 className="text-sm font-semibold text-slate-100">
                  Progress
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="h-2 w-24 rounded-full bg-slate-800"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={project.progress}
                  >
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-200">
                    {project.progress}%
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                <h2 className="text-sm font-semibold text-slate-100">
                  Budget
                </h2>
                <p className="mt-1 text-lg font-bold text-slate-50">
                  ${project.budget.toLocaleString()}
                </p>
              </div>
            </section>
          )}

          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Tasks</h2>
                <p className="text-xs text-slate-400">
                  Add, edit, filter and bulk update task status. Auto-refresh
                  every 5s simulates real-time updates.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 py-1">
                  <input
                    type="search"
                    placeholder="Search tasks..."
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    className="border-none bg-transparent px-2 py-1 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                    aria-label="Search tasks by title or assignee"
                  />
                </div>

                <select
                  value={taskStatusFilter}
                  onChange={(e) =>
                    setTaskStatusFilter(e.target.value as TaskStatusFilter)
                  }
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-100"
                  aria-label="Filter tasks by status"
                >
                  <option value="All">All statuses</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>

                <button
                  type="button"
                  disabled={selectedTasks.length === 0}
                  onClick={() => bulkUpdateMutation.mutate("Todo")}
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-100 disabled:opacity-40"
                >
                  Mark Todo
                </button>
                <button
                  type="button"
                  disabled={selectedTasks.length === 0}
                  onClick={() => bulkUpdateMutation.mutate("In Progress")}
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-100 disabled:opacity-40"
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  disabled={selectedTasks.length === 0}
                  onClick={() => bulkUpdateMutation.mutate("Done")}
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-100 disabled:opacity-40"
                >
                  Mark Done
                </button>
              </div>
            </header>

            {tasksQuery.isLoading ? (
              <div
                className="animate-pulse space-y-2"
                aria-busy="true"
                aria-label="Loading tasks"
              >
                <div className="h-4 rounded bg-slate-800" />
                <div className="h-4 w-5/6 rounded bg-slate-800" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full text-xs"
                  role="grid"
                  aria-label="Tasks table"
                >
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-left text-[11px] font-semibold text-slate-400">
                      <th className="px-2 py-2">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="px-2 py-2">Title</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2">Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-slate-800 last:border-none hover:bg-slate-900/80"
                      >
                        <td className="px-2 py-2">
                          <input
                            type="checkbox"
                            aria-label={`Select task ${t.title}`}
                            checked={selectedTasks.includes(t.id)}
                            onChange={() => toggleTaskSelection(t.id)}
                          />
                        </td>

                        <td className="px-2 py-2 text-slate-100">
                          <input
                            defaultValue={t.title}
                            onBlur={(e) =>
                              handleInlineEdit(t.id, "title", e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleInputKey(e, t.id, "title")
                            }
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                        </td>

                        {/* status (read-only here – بنغيره من bulk) */}
                        <td className="px-2 py-2 text-slate-200">
                          {t.status}
                        </td>

                        {/* editable assignee */}
                        <td className="px-2 py-2 text-slate-200">
                          <input
                            defaultValue={t.assignee}
                            onBlur={(e) =>
                              handleInlineEdit(
                                t.id,
                                "assignee",
                                e.target.value
                              )
                            }
                            onKeyDown={(e) =>
                              handleInputKey(e, t.id, "assignee")
                            }
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add task form */}
            <form
              className="mt-2 flex flex-col gap-2 border-t border-slate-800 pt-2 md:flex-row md:items-center"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTaskTitle) return;
                addTaskMutation.mutate();
              }}
              aria-label="Add new task form"
            >
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New task title"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                aria-label="New task title"
              />
              <input
                type="text"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                placeholder="Assignee"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                aria-label="Task assignee"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-3 py-1 text-xs font-semibold text-slate-900 shadow-md shadow-cyan-500/30 hover:brightness-110"
              >
                Add Task
              </button>
            </form>
          </section>
        </div>
      </MainLayout>
    </RequireAuth>
  );
}
