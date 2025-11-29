"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import MainLayout from "@/components/layout/MainLayout";
import ProjectTable from "@/components/projects/ProjectTable";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const progressData = [
  { month: "Jan", value: 20 },
  { month: "Feb", value: 35 },
  { month: "Mar", value: 50 },
  { month: "Apr", value: 70 },
  { month: "May", value: 90 },
];

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user);

  return (
    <RequireAuth>
      <MainLayout>
        <div className="space-y-6">
          <header className="flex flex-col gap-3 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Overview
              </p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl text-slate-50">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  {user?.name || "User"}
                </span>
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Role-based dashboard for{" "}
                <span className="font-semibold text-slate-100">
                  {user?.role}
                </span>
                .
              </p>
            </div>

            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live updates every 5 seconds
              </span>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Total Projects
                  </h2>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">3</p>
                  <p className="mt-1 text-xs text-emerald-300">+1 vs last month</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-lg">
                  📊
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-emerald-500/20 to-transparent" />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    In Progress
                  </h2>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">1</p>
                  <p className="mt-1 text-xs text-indigo-300">
                    33% of total projects
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-lg">
                  ⚙️
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-indigo-500/25 to-transparent" />
            </div>

        
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Completed
                  </h2>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">0</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Ready to be shipped & archived
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-lg">
                  ✅
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-violet-500/25 to-transparent" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-50">
                  Project Progress Overview
                </h2>
                <p className="text-xs text-slate-400">
                  Mocked analytics for the last 5 months
                </p>
              </div>
              <span className="text-[11px] text-slate-500">Mocked data</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "#1e293b",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <ProjectTable />
        </div>
      </MainLayout>
    </RequireAuth>
  );
}
