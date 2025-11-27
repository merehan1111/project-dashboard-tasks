// "use client";

// import RequireAuth from "@/components/auth/RequireAuth";
// import MainLayout from "@/components/layout/MainLayout";
// import ProjectTable from "@/components/projects/ProjectTable";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/redux/store";

// export default function DashboardPage() {
//   const user = useSelector((s: RootState) => s.auth.user);

//   return (
//     <RequireAuth>
//       <MainLayout>
//         <div className="space-y-6">
//           {/* ===== Header ===== */}
//           <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
//                 Overview
//               </p>
//               <h1 className="mt-1 text-2xl font-bold md:text-3xl">
//                 Welcome,{" "}
//                 <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
//                   {user?.name || "User"}
//                 </span>
//               </h1>
//               <p className="mt-1 text-sm text-slate-500">
//                 Role-based dashboard for{" "}
//                 <span className="font-semibold">{user?.role}</span>.
//               </p>
//             </div>

//             <div className="flex gap-2 text-xs">
//               <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
//                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                 Live updates every 5 seconds
//               </span>
//             </div>
//           </header>

//           {/* ===== KPI Cards ===== */}
//           <section className="grid gap-4 md:grid-cols-3">
//             {/* Total Projects */}
//             <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
//               <div className="flex items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                     Total Projects
//                   </h2>
//                   <p className="mt-2 text-3xl font-semibold text-slate-900">
//                     3
//                   </p>
//                   <p className="mt-1 text-xs text-emerald-600">
//                     +1 vs last month
//                   </p>
//                 </div>
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
//                   📊
//                 </div>
//               </div>
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-emerald-50 to-transparent" />
//             </div>

//             {/* In Progress */}
//             <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
//               <div className="flex items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                     In Progress
//                   </h2>
//                   <p className="mt-2 text-3xl font-semibold text-slate-900">
//                     1
//                   </p>
//                   <p className="mt-1 text-xs text-indigo-600">
//                     33% of total projects
//                   </p>
//                 </div>
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
//                   ⚙️
//                 </div>
//               </div>
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-indigo-50 to-transparent" />
//             </div>

//             {/* Completed */}
//             <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
//               <div className="flex items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                     Completed
//                   </h2>
//                   <p className="mt-2 text-3xl font-semibold text-slate-900">
//                     0
//                   </p>
//                   <p className="mt-1 text-xs text-slate-500">
//                     Ready to be shipped & archived
//                   </p>
//                 </div>
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
//                   ✅
//                 </div>
//               </div>
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-violet-50 to-transparent" />
//             </div>
//           </section>

//           {/* ===== Projects Table ===== */}
//           <ProjectTable />
//         </div>
//       </MainLayout>
//     </RequireAuth>
//   );
// }



"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import MainLayout from "@/components/layout/MainLayout";
import ProjectTable from "@/components/projects/ProjectTable";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user);

  return (
    <RequireAuth>
      <MainLayout>
        <div className="space-y-6">
          {/* ===== Header ===== */}
          <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Overview
              </p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                  {user?.name || "User"}
                </span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Role-based dashboard for{" "}
                <span className="font-semibold">{user?.role}</span>.
              </p>
            </div>

            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live updates every 5 seconds
              </span>
            </div>
          </header>

          {/* ===== KPI Cards ===== */}
          <section className="grid gap-4 md:grid-cols-3">
            {/* Total Projects */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Total Projects
                  </h2>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    3
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    +1 vs last month
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                  📊
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-emerald-50 to-transparent" />
            </div>

            {/* In Progress */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    In Progress
                  </h2>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    1
                  </p>
                  <p className="mt-1 text-xs text-indigo-600">
                    33% of total projects
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                  ⚙️
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-indigo-50 to-transparent" />
            </div>

            {/* Completed */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Completed
                  </h2>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    0
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Ready to be shipped & archived
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
                  ✅
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-violet-50 to-transparent" />
            </div>
          </section>

          {/* ===== Projects Table ===== */}
          <ProjectTable />
        </div>
      </MainLayout>
    </RequireAuth>
  );
}
