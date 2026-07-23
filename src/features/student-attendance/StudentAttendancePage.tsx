import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Download, UserCheck, UserX, type LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../components/common/Button';
import { DataTable, type TableColumn } from '../../components/common/DataTable';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { cn } from '../../lib/cn';
import { useAppDataStore } from '../../stores/useAppDataStore';
import { useUiStore } from '../../stores/useUiStore';
import type { AttendanceStatus, StudentAttendance } from '../../types';

const attendanceOptions: Array<{ value: AttendanceStatus; label: string; activeClass: string }> = [
  { value: 'present', label: '出席', activeClass: 'border-emerald-600 bg-emerald-600 text-white' },
  { value: 'late', label: '遲到', activeClass: 'border-amber-500 bg-amber-500 text-white' },
  { value: 'leave', label: '請假', activeClass: 'border-sky-600 bg-sky-600 text-white' },
  { value: 'absent', label: '缺席', activeClass: 'border-rose-600 bg-rose-600 text-white' },
];

export function StudentAttendancePage() {
  const [search, setSearch] = useState('');
  const attendance = useAppDataStore((state) => state.studentAttendance);
  const setAttendance = useAppDataStore((state) => state.setStudentAttendance);
  const showToast = useUiStore((state) => state.showToast);
  const filtered = useMemo(() => attendance.filter((record) => record.studentName.includes(search) || record.className.includes(search)), [attendance, search]);
  const counts = (status: AttendanceStatus) => attendance.filter((record) => record.status === status).length;
  const summary: Array<{ label: string; value: number; icon: LucideIcon; colors: string }> = [
    { label: '已出席', value: counts('present'), icon: UserCheck, colors: 'text-emerald-600 bg-emerald-50' },
    { label: '遲到', value: counts('late'), icon: Clock3, colors: 'text-amber-600 bg-amber-50' },
    { label: '請假', value: counts('leave'), icon: CalendarDays, colors: 'text-sky-600 bg-sky-50' },
    { label: '缺席', value: counts('absent'), icon: UserX, colors: 'text-rose-600 bg-rose-50' },
  ];

  const columns: TableColumn<StudentAttendance>[] = [
    { key: 'student', header: '學生', render: (record) => <div><p className="font-bold text-slate-900">{record.studentName}</p><p className="mt-1 text-xs text-slate-400">{record.className}</p></div> },
    { key: 'checkin', header: '到班時間', render: (record) => record.checkIn },
    { key: 'checkout', header: '離班時間', render: (record) => record.checkOut },
    { key: 'status', header: '點名狀態', render: (record) => <div className="flex flex-wrap gap-1.5">{attendanceOptions.map((option) => <button key={option.value} type="button" onClick={() => { setAttendance(record.id, option.value); showToast(`${record.studentName} 已標記為${option.label}`); }} className={cn('rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-800', record.status === option.value && option.activeClass)}>{option.label}</button>)}</div> },
    { key: 'note', header: '備註', render: (record) => record.note || <span className="text-slate-300">—</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="學生出缺勤" description="完成每日到班點名、請假紀錄與離班確認，異常狀況會同步顯示。" actions={<Button variant="secondary"><Download className="size-4" />匯出紀錄</Button>} />
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><Button variant="ghost" size="icon"><ChevronLeft className="size-4" /></Button><div className="min-w-44 text-center"><p className="text-sm font-bold text-slate-900">2026 年 7 月 21 日</p><p className="mt-0.5 text-xs text-slate-400">星期二 · 今日</p></div><Button variant="ghost" size="icon"><ChevronRight className="size-4" /></Button></div><div className="flex gap-2"><Button variant="secondary"><CalendarDays className="size-4" />選擇日期</Button><Button onClick={() => showToast('已儲存今日所有點名紀錄')}><Check className="size-4" />儲存點名</Button></div></div>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map(({ label, value, icon: Icon, colors }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p></div><div className={`grid size-10 place-items-center rounded-xl ${colors}`}><Icon className="size-5" /></div></div></div>)}
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><SearchInput value={search} onChange={setSearch} className="sm:max-w-sm" placeholder="搜尋學生或班級" /><div className="flex items-center gap-2"><select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600"><option>全部班級</option><option>國一數學 A</option><option>國二英文 A</option></select><StatusBadge status="active" label={`${attendance.length} 位學生`} /></div></div>
        <DataTable data={filtered} columns={columns} getRowKey={(record) => record.id} mobileTitle={(record) => record.studentName} />
      </section>
    </div>
  );
}
