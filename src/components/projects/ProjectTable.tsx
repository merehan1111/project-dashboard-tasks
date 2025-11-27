// 

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProjects, updateProjectPartial } from "@/lib/mockApi";
import type { ProjectStatus, Priority, Project } from "@/types";
import Link from "next/link";

const PAGE_SIZE = 5;

export default function ProjectTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "All">("All");
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [sortBy, setSortBy] =
    useState<"name" | "startDate" | "endDate" | "progress" | "budget">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["projects", { page, search, status, priority, sortBy, sortDir }],
    queryFn: () =>
      listProjects({
        page,
        pageSize: PAGE_SIZE,
        search,
        status,
        priority,
        sortBy,
        sortDir,
      }),
    refetchInterval: 5000,
  });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; patch: Partial<Project> }) =>
      updateProjectPartial(payload.id, payload.patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const prev = queryClient.getQueryData<any>([
        "projects",
        { page, search, status, priority, sortBy, sortDir },
      ]);
      if (prev) {
        queryClient.setQueryData<any>(
          ["projects", { page, search, status, priority, sortBy, sortDir }],
          {
            ...prev,
            items: prev.items.map((p: Project) =>
              p.id === id ? { ...p, ...patch } : p
            ),
          }
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(
          ["projects", { page, search, status, priority, sortBy, sortDir }],
          ctx.prev
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleInlineChange = (
    id: string,
    field: "status" | "budget",
    value: string
  ) => {
    const patch: any = {};
    if (field === "budget") patch[field] = Number(value) || 0;
    else patch[field] = value;
    mutation.mutate({ id, patch });
  };

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const statusBadge = (s: ProjectStatus) => {
    const base =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";
    switch (s) {
      case "Planned":
        return (
          <span className={`${base} bg-sky-50 text-sky-700 border border-sky-100`}>
            ● Planned
          </span>
        );
      case "In Progress":
        return (
          <span
            className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100`}
          >
            ● In Progress
          </span>
        );
      case "On Hold":
        return (
          <span
            className={`${base} bg-amber-50 text-amber-700 border border-amber-100`}
          >
            ● On Hold
          </span>
        );
      case "Completed":
        return (
          <span
            className={`${base} bg-violet-50 text-violet-700 border border-violet-100`}
          >
            ● Completed
          </span>
        );
    }
  };

  const priorityBadge = (p: Priority) => {
    const base =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";
    switch (p) {
      case "High":
        return (
          <span className={`${base} bg-rose-50 text-rose-700 border border-rose-100`}>
            High
          </span>
        );
      case "Medium":
        return (
          <span
            className={`${base} bg-amber-50 text-amber-700 border border-amber-100`}
          >
            Medium
          </span>
        );
      case "Low":
        return (
          <span
            className={`${base} bg-slate-50 text-slate-700 border border-slate-200`}
          >
            Low
          </span>
        );
    }
  };

  return (
    <section aria-label="Projects list" className="space-y-4">
      {/* ===== Header + Filters ===== */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
          <p className="text-xs text-slate-500">
            Pagination, search, advanced filtering & inline editing with
            optimistic updates.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center rounded-full bg-white px-2 py-1 shadow-sm border border-slate-200">
            <input
              type="search"
              placeholder="Search by name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border-none bg-transparent px-2 py-1 text-xs outline-none"
              aria-label="Search by name"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm"
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value as any);
              setPage(1);
            }}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm"
            aria-label="Filter by priority"
          >
            <option value="All">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* ===== Table Card ===== */}
      <div className="rounded-2xl border border-slate-100 bg-white p-3 md:p-4 shadow-sm">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
            <div className="h-4 w-2/3 rounded bg-slate-200" />
          </div>
        ) : (
          <div className="table-scroll">
            <table className="min-w-full text-xs md:text-sm" role="grid">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-[11px] font-semibold text-slate-500">
                  <th className="px-2 py-2">
                    <button
                      onClick={() => toggleSort("name")}
                      className="hover:text-slate-700"
                    >
                      Name
                    </button>
                  </th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">
                    <button
                      onClick={() => toggleSort("startDate")}
                      className="hover:text-slate-700"
                    >
                      Start
                    </button>
                  </th>
                  <th className="px-2 py-2">
                    <button
                      onClick={() => toggleSort("endDate")}
                      className="hover:text-slate-700"
                    >
                      End
                    </button>
                  </th>
                  <th className="px-2 py-2">Progress</th>
                  <th className="px-2 py-2">
                    <button
                      onClick={() => toggleSort("budget")}
                      className="hover:text-slate-700"
                    >
                      Budget
                    </button>
                  </th>
                  <th className="px-2 py-2">Owner</th>
                  <th className="px-2 py-2">Priority</th>
                  <th className="px-2 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-none hover:bg-slate-50/60"
                  >
                    <td className="px-2 py-2 font-medium text-slate-900">
                      {p.name}
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={p.status}
                        onChange={(e) =>
                          handleInlineChange(p.id, "status", e.target.value)
                        }
                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700"
                        aria-label={`Change status for ${p.name}`}
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-2 py-2 text-slate-700">{p.startDate}</td>
                    <td className="px-2 py-2 text-slate-700">{p.endDate}</td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                            style={{ width: `${p.progress}%` }}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-[11px] text-slate-700">
                          {p.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        value={p.budget}
                        onChange={(e) =>
                          handleInlineChange(p.id, "budget", e.target.value)
                        }
                        aria-label={`Edit budget for ${p.name}`}
                      />
                    </td>
                    <td className="px-2 py-2 text-slate-800">{p.owner}</td>
                    <td className="px-2 py-2">{priorityBadge(p.priority)}</td>
                    <td className="px-2 py-2">
                      <Link
                        href={`/projects/${p.id}`}
                        className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== Pagination ===== */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            Page {page} of {totalPages}{" "}
            {isFetching && (
              <span className="ml-2 text-indigo-500">Updating…</span>
            )}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full border border-slate-200 px-3 py-1 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-slate-200 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
