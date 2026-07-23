import { Mail, MoreHorizontal, Phone, Plus, UserCog, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../components/common/Button';
import { DataTable, type TableColumn } from '../../components/common/DataTable';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { roleLabels } from '../../mock/data';
import { useAppDataStore } from '../../stores/useAppDataStore';
import type { Staff } from '../../types';

export function StaffPage() {
  const [search, setSearch] = useState('');
  const staff = useAppDataStore((state) => state.staff);
  const filtered = useMemo(() => staff.filter((item) => item.name.includes(search) || item.title.includes(search) || item.email.includes(search)), [staff, search]);
  const columns: TableColumn<Staff>[] = [
    { key: 'staff', header: '教職員', render: (item) => <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-slate-900 text-xs font-bold text-white">{item.name.slice(-2)}</div><div><p className="font-bold text-slate-900">{item.name}</p><p className="mt-0.5 text-xs text-slate-400">{item.title}</p></div></div> },
    { key: 'role', header: '系統角色', render: (item) => roleLabels[item.role] },
    { key: 'contact', header: '聯絡方式', render: (item) => <div className="space-y-1"><span className="flex items-center gap-1.5 text-xs"><Phone className="size-3" />{item.phone}</span><span className="flex items-center gap-1.5 text-xs"><Mail className="size-3" />{item.email}</span></div> },
    { key: 'attendance', header: '本月出席率', render: (item) => `${item.attendanceRate}%` },
    { key: 'status', header: '任職狀態', render: (item) => <StatusBadge status={item.workStatus} /> },
    { key: 'action', header: '', className: 'text-right', render: () => <button type="button" aria-label="更多操作" className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><MoreHorizontal className="size-4" /></button> },
  ];
  return <div className="space-y-6"><PageHeader title="教職員管理" description="管理教師、行政與接送人員資料，以及系統角色與任職狀態。" actions={<Button><Plus className="size-4" />新增教職員</Button>} /><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><UsersRound className="size-5 text-slate-500" /><p className="mt-3 text-2xl font-bold text-slate-950">{staff.length + 18}</p><p className="mt-1 text-xs text-slate-500">在職夥伴</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><UserCog className="size-5 text-sky-600" /><p className="mt-3 text-2xl font-bold text-slate-950">14</p><p className="mt-1 text-xs text-slate-500">授課教師</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><StatusBadge status="active" label="人力配置正常" /><p className="mt-4 text-sm font-bold text-slate-800">本週無代課缺口</p><p className="mt-1 text-xs text-slate-500">下週尚有 1 個時段待確認</p></div></div><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"><div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><SearchInput value={search} onChange={setSearch} className="sm:max-w-sm" placeholder="搜尋姓名、職稱或信箱" /><select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600"><option>全部角色</option><option>教師</option><option>行政人員</option><option>接送人員</option></select></div><DataTable data={filtered} columns={columns} getRowKey={(item) => item.id} mobileTitle={(item) => item.name} /></section></div>;
}
