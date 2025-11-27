"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { loginSuccess, UserRole } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(4, "كلمة المرور يجب أن تكون ٤ أحرف على الأقل"),
  role: z.enum(["Admin", "ProjectManager", "Developer"], {
    required_error: "اختر الدور",
  }),
});

type LoginForm = z.infer<typeof loginSchema>;

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "Admin", label: "Admin" },
  { value: "ProjectManager", label: "Project Manager" },
  { value: "Developer", label: "Developer" },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [roleOpen, setRoleOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const selectedRole = watch("role");
  const selectedRoleLabel =
    ROLE_OPTIONS.find((r) => r.value === selectedRole)?.label || "اختر الدور";

  const onSubmit = async (data: LoginForm) => {
    dispatch(
      loginSuccess({
        user: { name: data.email.split("@")[0], role: data.role as UserRole },
        token: "fake-jwt",
      })
    );

    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0f19] px-4">
      {/* ===== Background animated shapes ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-fuchsia-500/20 blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
        className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-cyan-500/30 blur-[90px]"
      />

      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/30 blur-[100px]"
      />

      {/* ===== Login Card ===== */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10"
      >
        <div className="mb-6 text-center">
          <h1 className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-3xl font-bold text-transparent">
            Project Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            سجّل الدخول لاستخدام لوحة التحكم | Admin / PM / Developer
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm text-gray-200">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white shadow-inner outline-none focus:border-cyan-400"
              placeholder="yourname@mail.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm text-gray-200">
              كلمة المرور
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white shadow-inner outline-none focus:border-purple-400"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role - custom dropdown */}
          <div className="relative">
            <label className="mb-1 block text-sm text-gray-200">
              الدور (Role)
            </label>

            {/* hidden select just for react-hook-form compatibility */}
            <select
              {...register("role")}
              className="hidden"
         
            >
              <option value="">اختر الدور</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            {/* visible custom dropdown */}
            <button
              type="button"
              onClick={() => setRoleOpen((o) => !o)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm shadow-inner outline-none transition
                ${
                  errors.role
                    ? "border-red-400 bg-red-500/10 text-red-100"
                    : "border-white/10 bg-white/10 text-white hover:bg-white/15 focus:border-fuchsia-400"
                }`}
            >
              <span>{selectedRoleLabel}</span>
              <span className="text-xs text-slate-200">▾</span>
            </button>

            {roleOpen && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#050816] shadow-xl shadow-black/40">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    type="button"
                    key={role.value}
                    onClick={() => {
                      setValue("role", role.value, { shouldValidate: true });
                      setRoleOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-slate-100 hover:bg-white/10 ${
                      selectedRole === role.value ? "bg-white/10" : ""
                    }`}
                  >
                    <span>{role.label}</span>
                    {selectedRole === role.value && (
                      <span className="text-[10px] text-cyan-300">
                        مختار
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {errors.role && (
              <p className="mt-1 text-xs text-red-300">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 py-3 text-center text-black font-semibold shadow-xl shadow-cyan-500/20 hover:brightness-110 transition"
          >
            {isSubmitting ? "جارٍ التحقق..." : "تسجيل الدخول"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
