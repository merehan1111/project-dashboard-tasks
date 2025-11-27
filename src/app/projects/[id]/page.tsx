"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProject, listTasks, addTask, updateTasksStatus } from "@/lib/mockApi";
import RequireAuth from "@/components/auth/RequireAuth";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { useState } from "react";

interface Props {
  params: { id: string };
}

export default function ProjectDetailsPage({ params }: Props) {
  const { id } = params;
  const queryClient = useQueryClient();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    refetchInterval: 5000
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => listTasks(id),
    refetchInterval: 5000
  });

  const addTaskMutation = useMutation({
    mutationFn: () => addTask(id, newTaskTitle, newTaskAssignee),
    onSuccess: () => {
      setNewTaskTitle("");
      setNewTaskAssignee("");
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    }
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: (status: "Todo" | "In Progress" | "Done") =>
      updateTasksStatus(id, selectedTasks, status),
    onSuccess: () => {
      setSelectedTasks([]);
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    }
  });

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <RequireAuth>
      <MainLayout>
        <div className="space-y-6">
          <Link
            href="/dashboard"
            className="text-xs text-indigo-600 hover:underline"
          >
            ← Back to dashboard
          </Link>

          {projectQuery.isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ) : projectQuery.data ? (
            <header className="space-y-1">
              <h1 className="text-2xl font-bold">{projectQuery.data.name}</h1>
              <p className="text-sm text-slate-500">
                Status: {projectQuery.data.status} • Owner:{" "}
                {projectQuery.data.owner}
              </p>
            </header>
          ) : (
            <p className="text-sm text-red-500">Project not found.</p>
          )}

          <section className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-slate-600">
                Dates
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {projectQuery.data?.startDate} → {projectQuery.data?.endDate}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-slate-600">
                Progress
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-24 h-2 rounded bg-slate-200">
                  <div
                    className="h-2 rounded bg-emerald-500"
                    style={{ width: `${projectQuery.data?.progress ?? 0}%` }}
                  />
                </div>
                <span className="text-xs">
                  {projectQuery.data?.progress ?? 0}%
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-slate-600">
                Budget
              </h2>
              <p className="text-lg font-bold mt-1">
                ${projectQuery.data?.budget.toLocaleString()}
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  Tasks
                </h2>
                <p className="text-xs text-slate-500">
                  Add, edit, and bulk update task status. Auto-refresh
                  simulates real-time updates.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  disabled={selectedTasks.length === 0}
                  onClick={() => bulkUpdateMutation.mutate("Todo")}
                  className="px-2 py-1 rounded border disabled:opacity-40"
                >
                  Mark Todo
                </button>
                <button
                  disabled={selectedTasks.length === 0}
                  onClick={() => bulkUpdateMutation.mutate("In Progress")}
                  className="px-2 py-1 rounded border disabled:opacity-40"
                >
                  Mark In Progress
                </button>
                <button
                  disabled={selectedTasks.length === 0}
                  onClick={() => bulkUpdateMutation.mutate("Done")}
                  className="px-2 py-1 rounded border disabled:opacity-40"
                >
                  Mark Done
                </button>
              </div>
            </header>

            {tasksQuery.isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-slate-50 text-left text-[11px] font-semibold text-slate-500">
                    <th className="px-2 py-2">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-2 py-2">Title</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {tasksQuery.data?.map((t) => (
                    <tr key={t.id} className="border-b last:border-none">
                      <td className="px-2 py-2">
                        <input
                          type="checkbox"
                          aria-label={`Select task ${t.title}`}
                          checked={selectedTasks.includes(t.id)}
                          onChange={() => toggleTaskSelection(t.id)}
                        />
                      </td>
                      <td className="px-2 py-2">{t.title}</td>
                      <td className="px-2 py-2">{t.status}</td>
                      <td className="px-2 py-2">{t.assignee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <form
              className="flex flex-col gap-2 md:flex-row md:items-center pt-2 border-t mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTaskTitle) return;
                addTaskMutation.mutate();
              }}
            >
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New task title"
                className="flex-1 border rounded px-2 py-1 text-xs"
              />
              <input
                type="text"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                placeholder="Assignee"
                className="flex-1 border rounded px-2 py-1 text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-slate-900 text-white text-xs hover:bg-slate-800"
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
