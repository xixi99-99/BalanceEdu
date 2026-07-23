import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface StatCardProps {
  label: string;
  value: string;
  helper: string;
  trend?: number;
  icon: LucideIcon;
  tone?: 'slate' | 'emerald' | 'sky' | 'amber' | 'rose';
}

const toneClasses = {
  slate: 'bg-slate-100 text-slate-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  sky: 'bg-sky-50 text-sky-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
};

export function StatCard({ label, value, helper, trend, icon: Icon, tone = 'slate' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={cn('grid size-11 place-items-center rounded-xl', toneClasses[tone])}>
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        {trend !== undefined && (
          <span className={cn('inline-flex items-center gap-0.5 font-bold', trend >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
            {trend >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
        <span>{helper}</span>
      </div>
    </div>
  );
}
