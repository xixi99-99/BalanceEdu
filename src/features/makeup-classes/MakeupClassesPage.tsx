import { CalendarCheck2, CalendarClock, Clock3, Plus, UserRoundCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../components/common/Button';
import { DataTable, type TableColumn } from '../../components/common/DataTable';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAppDataStore } from '../../stores/useAppDataStore';
import type { MakeupClass } from '../../types';

export function MakeupClassesPage() {
  const [search, setSearch] = useState('');
  const records = useAppDataStore((state) => state.makeupClasses);
  const filtered = useMemo(() => records.filter((record) => record.studentName.includes(search) || record.courseName.includes(search) || record.teacherName.includes(search)), [records, search]);
  const columns: TableColumn<MakeupClass>[] = [
    { key: 'student', header: '學生', render: (record) => <p className="font-bold text-slate-900">{record.studentName}</p> },
    { key: 'course', header: '缺課課程', render: (record) => record.courseName },
    { key: 'original', header: '原課程日期', render: (record) => record.originalDate },
    { key: 'schedule', header: '補課安排', render: (record) => <span className={record.scheduledDate === '尚未安排' ? 'font-semibold text-amber-600' : ''}>{record.scheduledDate}</span> },
    { key: 'teacher', header: '負責教師', render: (record) => record.teacherName },
    { key: 'status', header: '狀態', render: (record) => <StatusBadge status={record.status} /> },
  ];
  const summary: Array<{ label: string; value: string; icon: typeof CalendarClock; style: string }> = [
    { label: '待安排', value: `${records.filter((item) => item.status === 'pending').length} 筆`, icon: Clock3, style: 'bg-amber-50 text-amber-600' },
    { label: '已安排', value: `${records.filter((item) => item.status === 'scheduled').length} 筆`, icon: CalendarClock, style: 'bg-sky-50 text-sky-600' },
    { label: '本月完成', value: '18 筆', icon: CalendarCheck2, style: 'bg-emerald-50 text-emerald-600' },
    { label: '補課教師', value: '6 位', icon: UserRoundCheck, style: 'bg-slate-100 text-slate-600' },
  ];
  return <div className="space-y-6"><PageHeader title="補課管理" description="追蹤學生缺課、補課時段與負責教師，避免補課事項遺漏。" actions={<Button><Plus className="size-4" />新增補課</Button>} /><section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{summary.map(({ label, value, icon: Icon, style }) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"><div className={`grid size-10 place-items-center rounded-xl ${style}`}><Icon className="size-5" /></div><div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-slate-950">{value}</p></div></div>)}</section><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"><div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><SearchInput value={search} onChange={setSearch} className="sm:max-w-sm" placeholder="搜尋學生、課程或教師" /><div className="flex gap-2"><select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600"><option>全部狀態</option><option>待安排</option><option>已安排</option><option>已完成</option></select><Button variant="secondary">本月紀錄</Button></div></div><DataTable data={filtered} columns={columns} getRowKey={(record) => record.id} mobileTitle={(record) => record.studentName} /></section></div>;
}
