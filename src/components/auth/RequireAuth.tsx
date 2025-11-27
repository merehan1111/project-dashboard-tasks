"use client";

import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/redux/store";
import type { UserRole } from "@/redux/slices/authSlice";

interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function RequireAuth({ children, allowedRoles }: Props) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Checking authentication…</p>
      </div>
    );
  }

  return <>{children}</>;
}
