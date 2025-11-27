"use client";

import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((s: RootState) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 hidden md:flex flex-col border-r border-slate-800 bg-slate-950 text-slate-50 px-5 py-6">
        {/* Logo / Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 text-lg font-bold shadow-lg shadow-cyan-500/30">
            PD
          </div>
          <div>
            <h2 className="text-sm font-semibold">Project Dashboard</h2>
            <p className="text-[11px] text-slate-400">
              Realtime project insights
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 text-sm">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/40 hover:bg-slate-800 transition"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Dashboard</span>
          </button>
          {/* لو حبيتي بعدين تزودي صفحات تانية، زودي أزرار هنا بنفس الستايل */}
        </nav>

        {/* User card */}
        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-xs">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-[11px] text-slate-400">{user?.role}</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
              Active
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ===== Mobile top sidebar (simple) ===== */}
      <aside className="md:hidden fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 text-sm font-semibold">
            PD
          </div>
          <span className="text-sm font-medium">Project Dashboard</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[11px] rounded-full border border-slate-300 px-3 py-1 text-slate-600"
        >
          Logout
        </button>
      </aside>

      {/* ===== Main content ===== */}
      <main className="flex-1 px-4 py-4 md:px-8 md:py-8 bg-slate-50 overflow-x-hidden md:ml-0 pt-14 md:pt-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
