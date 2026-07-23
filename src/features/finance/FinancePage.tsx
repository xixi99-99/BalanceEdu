import { zodResolver } from '@hookform/resolvers/zod';
import { CircleDollarSign, Download, Plus, ReceiptText, TrendingUp, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { DataTable, type TableColumn } from '../../components/common/DataTable';
import { FormField, SelectField } from '../../components/common/FormField';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAppDataStore } from '../../stores/useAppDataStore';
import { useUiStore } from '../../stores/useUiStore';
import type { Payment } from '../../types';

const paymentSchema = z.object({
  studentName: z.string().min(2, '請輸入學生姓名'),
  item: z.string().min(2, '請輸入收費項目'),
  amount: z.number({ invalid_type_error: '請輸入正確金額' }).positive('金額必須大於 0'),
  dueDate: z.string().min(1, '請選擇繳費期限'),
  status: z.enum(['paid', 'pending', 'overdue', 'refunded']),
  method: z.string().min(1, '請選擇付款方式'),
});
type PaymentFormValues = z.infer<typeof paymentSchema>;

export function FinancePage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const payments = useAppDataStore((state) => state.payments);
  const addPayment = useAppDataStore((state) => state.addPayment);
  const showToast = useUiStore((state) => state.showToast);
  const form = useForm<PaymentFormValues>({ resolver: zodResolver(paymentSchema), defaultValues: { studentName: '', item: '', amount: 0, dueDate: '2026-07-31', status: 'pending', method: '—' } });
  const filtered = useMemo(() => payments.filter((payment) => payment.studentName.includes(search) || payment.item.includes(search)), [payments, search]);
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paid = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const overdue = payments.filter((payment) => payment.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);
  const currency = (amount: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(amount);
  const columns: TableColumn<Payment>[] = [
    { key: 'student', header: '學生', render: (payment) => <p className="font-bold text-slate-900">{payment.studentName}</p> },
    { key: 'item', header: '收費項目', render: (payment) => payment.item },
    { key: 'amount', header: '應收金額', render: (payment) => <p className="font-bold text-slate-900">{currency(payment.amount)}</p> },
    { key: 'due', header: '繳費期限', render: (payment) => payment.dueDate },
    { key: 'method', header: '付款方式', render: (payment) => payment.method },
    { key: 'status', header: '狀態', render: (payment) => <StatusBadge status={payment.status} /> },
  ];
  const submitPayment = (values: PaymentFormValues) => { addPayment(values); form.reset(); setModalOpen(false); showToast('收費紀錄已建立'); };

  return (
    <div className="space-y-6">
      <PageHeader title="財務管理" description="掌握學費收款、逾期款項與退款紀錄，數字皆為前端模擬資料。" actions={<><Button variant="secondary"><Download className="size-4" />匯出報表</Button><Button onClick={() => setModalOpen(true)}><Plus className="size-4" />新增收費</Button></>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="本月應收" value={currency(total + 820000)} helper="較上月增加 3.8%" trend={3.8} icon={ReceiptText} /><StatCard label="本月已收" value={currency(paid + 758000)} helper="收款達成率 86%" trend={8.4} icon={CircleDollarSign} tone="emerald" /><StatCard label="待收款" value={currency(total - paid)} helper="共 4 筆待處理" icon={TrendingUp} tone="sky" /><StatCard label="逾期款項" value={currency(overdue)} helper="需要優先追蹤" icon={TriangleAlert} tone="rose" /></section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"><div className="border-b border-slate-200 p-1.5"><div className="flex gap-1 overflow-x-auto"><button className="whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">收費管理</button><button className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100">退款紀錄</button><button className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100">月結報表</button></div></div><div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><SearchInput value={search} onChange={setSearch} className="sm:max-w-sm" placeholder="搜尋學生或收費項目" /><select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600"><option>全部狀態</option><option>已繳費</option><option>待處理</option><option>已逾期</option></select></div><DataTable data={filtered} columns={columns} getRowKey={(payment) => payment.id} mobileTitle={(payment) => payment.studentName} /></section>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="新增收費紀錄" description="建立一筆新的應收款項。"><form onSubmit={form.handleSubmit(submitPayment)} className="space-y-5 p-5 sm:p-6" noValidate><FormField label="學生姓名" required error={form.formState.errors.studentName?.message} {...form.register('studentName')} /><FormField label="收費項目" placeholder="例：八月份月費" required error={form.formState.errors.item?.message} {...form.register('item')} /><div className="grid gap-4 sm:grid-cols-2"><FormField label="應收金額" type="number" min="1" required error={form.formState.errors.amount?.message} {...form.register('amount', { valueAsNumber: true })} /><FormField label="繳費期限" type="date" required error={form.formState.errors.dueDate?.message} {...form.register('dueDate')} /></div><div className="grid gap-4 sm:grid-cols-2"><SelectField label="收款狀態" required error={form.formState.errors.status?.message} selectProps={form.register('status')}><option value="pending">待處理</option><option value="paid">已繳費</option><option value="overdue">已逾期</option><option value="refunded">已退款</option></SelectField><SelectField label="付款方式" required error={form.formState.errors.method?.message} selectProps={form.register('method')}><option value="—">尚未付款</option><option>現金</option><option>轉帳</option><option>信用卡</option></SelectField></div><div className="flex justify-end gap-2 border-t border-slate-100 pt-5"><Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>取消</Button><Button type="submit">建立收費</Button></div></form></Modal>
    </div>
  );
}
