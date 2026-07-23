import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../../components/common/Button";
import { FormField, SelectField } from "../../components/common/FormField";
import { roleLabels } from "../../mock/data";
import { useAuthStore } from "../../stores/useAuthStore";

const loginSchema = z.object({
  email: z.string().min(1, "請輸入電子信箱").email("電子信箱格式不正確"),
  password: z.string().min(6, "密碼至少需要 6 個字元"),
  role: z.enum(["system-admin", "administrator", "teacher", "driver"]),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@balance.edu.tw",
      password: "Balance123",
      role: "system-admin",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 500));
    login(values.role);
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -left-32 top-1/3 size-[420px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -right-20 bottom-10 size-[360px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-white font-black text-slate-950">
            衡
          </div>
          <div>
            <p className="font-bold text-white">衡學管理平台</p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              BalanceEdu
            </p>
          </div>
        </div>
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="size-3.5 text-amber-400" />
            補教營運，一站掌握
          </span>
          <h1 className="mt-7 text-5xl font-bold leading-[1.12] tracking-tight text-white xl:text-6xl">
            把每天的教務，
            <br />
            <span className="text-slate-400">變得清楚而從容。</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
            整合學生、班務、財務、出缺勤與接送流程，讓每一位夥伴都能掌握真正重要的事。
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              ["128", "在籍學生"],
              ["12", "進行中班級"],
              ["96.8%", "本月出席率"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-slate-600">
          © 2026 BalanceEdu. 專為成長中的教育團隊設計。
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-9 flex items-center gap-3 lg:hidden">
            <div className="grid size-10 place-items-center rounded-xl bg-slate-900 font-black text-white">
              衡
            </div>
            <div>
              <p className="font-bold text-slate-950">衡學管理平台</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                BalanceEdu
              </p>
            </div>
          </div>
          <div className="mb-8">
            <p className="text-sm font-bold text-slate-500">歡迎回來</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              登入管理平台
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              使用示範帳號登入，或切換不同角色查看權限介面。
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <FormField
              label="電子信箱"
              type="email"
              autoComplete="email"
              placeholder="name@balance.edu.tw"
              error={errors.email?.message}
              required
              {...register("email")}
            />
            <div className="relative">
              <FormField
                label="登入密碼"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="至少 6 個字元"
                error={errors.password?.message}
                required
                inputClassName="pr-11"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                className="absolute right-3 top-[39px] grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <SelectField
              label="示範角色"
              required
              error={errors.role?.message}
              selectProps={register("role")}
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 font-medium text-slate-600">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 accent-slate-900"
                  defaultChecked
                />
                記住登入狀態
              </label>
              <button
                type="button"
                className="font-bold text-slate-700 hover:text-slate-950"
              >
                忘記密碼？
              </button>
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              登入平台
            </Button>
          </form>
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-slate-800">示範模式</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                帳號與密碼已預填。所有操作只會保存在目前瀏覽器，不會傳送真實資料。
              </p>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <GraduationCap className="size-4" />
            為補教團隊打造的日常工作台
          </div>
        </div>
      </section>
    </main>
  );
}
