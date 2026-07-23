import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowKey: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  mobileTitle: (row: T) => ReactNode;
}

export function DataTable<T>({ data, columns, getRowKey, emptyTitle = '目前沒有資料', emptyDescription = '新增資料後會顯示在這裡。', loading = false, mobileTitle }: DataTableProps<T>) {
  if (loading) {
    return <div className="space-y-3 p-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>;
  }
  if (data.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center px-6 py-12 text-center">
        <div><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Inbox className="size-5" /></div><h3 className="mt-4 font-bold text-slate-900">{emptyTitle}</h3><p className="mt-1 text-sm text-slate-500">{emptyDescription}</p></div>
      </div>
    );
  }
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead><tr className="border-b border-slate-200 bg-slate-50/80">{columns.map((column) => <th key={column.key} className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 ${column.className ?? ''}`}>{column.header}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{data.map((row) => <tr key={getRowKey(row)} className="transition hover:bg-slate-50/80">{columns.map((column) => <td key={column.key} className={`px-5 py-4 text-sm text-slate-600 ${column.className ?? ''}`}>{column.render(row)}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {data.map((row) => (
          <div key={getRowKey(row)} className="p-4">
            <div className="mb-3 font-bold text-slate-900">{mobileTitle(row)}</div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {columns.slice(1).map((column) => <div key={column.key}><dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{column.header}</dt><dd className="mt-1 text-sm text-slate-700">{column.render(row)}</dd></div>)}
            </dl>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5">
        <p className="text-xs text-slate-500">顯示 1–{data.length} 筆，共 {data.length} 筆</p>
        <div className="flex gap-1"><Button variant="ghost" size="icon" disabled aria-label="上一頁"><ChevronLeft className="size-4" /></Button><Button variant="ghost" size="icon" disabled aria-label="下一頁"><ChevronRight className="size-4" /></Button></div>
      </div>
    </>
  );
}
