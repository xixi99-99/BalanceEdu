import { CalendarDays, Clock3, Download, UserCheck, UsersRound } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { DataTable, type TableColumn } from '../../components/common/DataTable';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAppDataStore } from '../../stores/useAppDataStore';
import type { TeacherAttendance } from '../../types';

export function TeacherAttendancePage() {
  const records = useAppDataStore((state) => state.teacherAttendance);
  const columns: TableColumn<TeacherAttendance>[] = [
    { key: 'staff', header: '教職員', render: (record) => <p className="font-bold text-slate-900">{record.staffName}</p> },
    { key: 'date', header: '日期', render: (record) => record.date },
    { key: 'checkin', header: '上班時間', render: (record) => record.checkIn },
    { key: 'checkout', header: '下班時間', render: (record) => record.checkOut },
    { key: 'hours', header: '工時', render: (record) => `${record.workHours} 小時` },
    { key: 'status', header: '狀態', render: (record) => <StatusBadge status={record.status} /> },
  ];
  return <div className="space-y-6"><PageHeader title="教師出缺勤" description="彙整教職員上下班紀錄、出勤狀態與當月工時。" actions={<Button variant="secondary"><Download className="size-4" />匯出月報</Button>} /><section className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><UsersRound className="size-5 text-slate-500" /><p className="mt-3 text-2xl font-bold">24 位</p><p className="mt-1 text-xs text-slate-500">今日應到</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><UserCheck className="size-5 text-emerald-600" /><p className="mt-3 text-2xl font-bold">23 位</p><p className="mt-1 text-xs text-slate-500">目前已到</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><Clock3 className="size-5 text-amber-600" /><p className="mt-3 text-2xl font-bold">1 位</p><p className="mt-1 text-xs text-slate-500">今日遲到</p></div></section><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"><div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><h2 className="font-bold text-slate-900">今日出勤</h2><p className="mt-1 text-xs text-slate-500">2026 年 7 月 21 日</p></div><Button variant="secondary"><CalendarDays className="size-4" />切換日期</Button></div><DataTable data={records} columns={columns} getRowKey={(record) => record.id} mobileTitle={(record) => record.staffName} /></section></div>;
}
