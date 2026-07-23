import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../../lib/cn';
import { useUiStore } from '../../stores/useUiStore';

export function Toast() {
  const toast = useUiStore((state) => state.toast);
  const clearToast = useUiStore((state) => state.clearToast);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(clearToast, 3500);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);
  if (!toast) return null;
  const Icon = toast.tone === 'success' ? CheckCircle2 : toast.tone === 'error' ? CircleAlert : Info;
  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] sm:bottom-6 sm:left-auto sm:right-6 sm:w-96">
      <div className={cn('flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-xl', toast.tone === 'success' && 'border-emerald-200', toast.tone === 'error' && 'border-rose-200', toast.tone === 'info' && 'border-sky-200')}>
        <Icon className={cn('size-5 shrink-0', toast.tone === 'success' && 'text-emerald-600', toast.tone === 'error' && 'text-rose-600', toast.tone === 'info' && 'text-sky-600')} />
        <p className="flex-1 text-sm font-semibold text-slate-800">{toast.message}</p>
        <button onClick={clearToast} type="button" aria-label="關閉通知" className="text-slate-400 hover:text-slate-700"><X className="size-4" /></button>
      </div>
    </div>
  );
}
