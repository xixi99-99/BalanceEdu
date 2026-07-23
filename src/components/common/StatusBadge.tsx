import { cn } from '../../lib/cn';

interface StatusBadgeProps {
  status: string;
  label?: string;
}

const labels: Record<string, string> = {
  active: '啟用中', inactive: '已停用', present: '出席', late: '遲到', leave: '請假', absent: '缺席',
  paid: '已繳費', pending: '待處理', overdue: '已逾期', refunded: '已退款', scheduled: '已安排',
  completed: '已完成', cancelled: '已取消', waiting: '等待接送', 'picked-up': '接送中', arrived: '已抵達',
  announcement: '公告', homework: '作業', activity: '活動', reminder: '提醒', pickup: '到校接送', dropoff: '返家接送',
};

const successStatuses = new Set(['active', 'present', 'paid', 'completed', 'arrived']);
const warningStatuses = new Set(['late', 'pending', 'scheduled', 'waiting', 'picked-up', 'reminder']);
const dangerStatuses = new Set(['inactive', 'absent', 'overdue', 'cancelled']);
const infoStatuses = new Set(['leave', 'refunded', 'announcement', 'homework', 'activity']);

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold',
      successStatuses.has(status) && 'border-emerald-200 bg-emerald-50 text-emerald-700',
      warningStatuses.has(status) && 'border-amber-200 bg-amber-50 text-amber-700',
      dangerStatuses.has(status) && 'border-rose-200 bg-rose-50 text-rose-700',
      infoStatuses.has(status) && 'border-sky-200 bg-sky-50 text-sky-700',
      !successStatuses.has(status) && !warningStatuses.has(status) && !dangerStatuses.has(status) && !infoStatuses.has(status) && 'border-slate-200 bg-slate-50 text-slate-600',
    )}>
      {label ?? labels[status] ?? status}
    </span>
  );
}
