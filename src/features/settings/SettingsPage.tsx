import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Building2, BusFront, CircleDollarSign, LockKeyhole, Save, ShieldCheck, SlidersHorizontal, UsersRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { PageHeader } from '../../components/common/PageHeader';
import { useUiStore } from '../../stores/useUiStore';

const settingsSchema = z.object({
  organizationName: z.string().min(2, '請輸入機構名稱'),
  phone: z.string().min(8, '請輸入有效電話'),
  email: z.string().email('電子信箱格式不正確'),
  address: z.string().min(6, '請輸入完整地址'),
  taxId: z.string().regex(/^\d{8}$/, '統一編號須為 8 碼數字'),
});
type SettingsValues = z.infer<typeof settingsSchema>;

const settingsNav = [
  { label: '機構基本資料', icon: Building2, active: true }, { label: '班級與學期', icon: UsersRound, active: false },
  { label: '收費項目', icon: CircleDollarSign, active: false }, { label: '出勤規則', icon: ShieldCheck, active: false },
  { label: '接送與車隊', icon: BusFront, active: false }, { label: '通知設定', icon: Bell, active: false },
  { label: '角色與權限', icon: LockKeyhole, active: false }, { label: '進階設定', icon: SlidersHorizontal, active: false },
];

export function SettingsPage() {
  const showToast = useUiStore((state) => state.showToast);
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { organizationName: '衡學文理短期補習班', phone: '02-2358-1688', email: 'hello@balance.edu.tw', address: '臺北市中正區衡陽路 88 號 2 樓', taxId: '83261048' },
  });
  return (
    <div className="space-y-6">
      <PageHeader title="系統設定" description="管理機構資料、收費規則、權限與通知偏好。" />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-card">{settingsNav.map(({ label, icon: Icon, active }) => <button key={label} type="button" className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><Icon className="size-[18px]" />{label}</button>)}</aside>
        <section className="rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7"><h2 className="text-lg font-bold text-slate-950">機構基本資料</h2><p className="mt-1 text-sm text-slate-500">這些資訊會顯示於收據、通知與家長端。</p></div>
          <form onSubmit={form.handleSubmit(() => showToast('系統設定已儲存'))} className="space-y-6 p-5 sm:p-7" noValidate>
            <div className="flex flex-col gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-center"><div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-slate-900 text-2xl font-black text-white">衡</div><div><p className="font-bold text-slate-900">機構識別圖示</p><p className="mt-1 text-xs leading-5 text-slate-500">建議使用 512 × 512 px 的 PNG 或 JPG，檔案不超過 2 MB。</p><Button type="button" variant="secondary" size="sm" className="mt-3">更換圖示</Button></div></div>
            <div className="grid gap-5 sm:grid-cols-2"><FormField label="機構名稱" required error={form.formState.errors.organizationName?.message} {...form.register('organizationName')} /><FormField label="統一編號" required inputMode="numeric" error={form.formState.errors.taxId?.message} {...form.register('taxId')} /><FormField label="聯絡電話" required error={form.formState.errors.phone?.message} {...form.register('phone')} /><FormField label="電子信箱" type="email" required error={form.formState.errors.email?.message} {...form.register('email')} /></div>
            <FormField label="機構地址" required error={form.formState.errors.address?.message} {...form.register('address')} />
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-sky-700" /><div><p className="text-sm font-bold text-sky-900">資料安全提示</p><p className="mt-1 text-xs leading-5 text-sky-700">此專案使用本機模擬資料。串接正式 API 前，請完成權限、稽核紀錄與個資保護設定。</p></div></div></div>
            <div className="flex justify-end border-t border-slate-100 pt-6"><Button type="submit"><Save className="size-4" />儲存變更</Button></div>
          </form>
        </section>
      </div>
    </div>
  );
}
