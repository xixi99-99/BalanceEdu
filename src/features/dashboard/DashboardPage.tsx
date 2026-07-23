import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { ArrowRight, BusFront, CalendarDays, CheckCircle2, Clock3, CircleDollarSign, GraduationCap, MoreHorizontal, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAppDataStore } from '../../stores/useAppDataStore';

const weekData = [72, 84, 78, 91, 88, 64, 48];
const weekLabels = ['一', '二', '三', '四', '五', '六', '日'];

export function DashboardPage() {
  const students = useAppDataStore((state) => state.students);
  const payments = useAppDataStore((state) => state.payments);
  const classes = useAppDataStore((state) => state.classes);
  const schedules = useAppDataStore((state) => state.schedules);
  const transportationTasks = useAppDataStore((state) => state.transportationTasks);
  const paidTotal = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const activeStudents = students.filter((student) => student.status === 'active');
  const averageAttendance = Math.round(activeStudents.reduce((sum, student) => sum + student.attendanceRate, 0) / activeStudents.length);

  return (
    <div className="space-y-7">
      <PageHeader eyebrow={format(new Date(2026, 6, 21), 'yyyy 年 M 月 d 日 EEEE', { locale: zhTW })} title="早安，今天也一起把事情做好。" description="這裡是衡學今天的營運摘要，尚有 3 項需要優先處理。" actions={<><Button variant="secondary"><CalendarDays className="size-4" />查看行事曆</Button><Button><CheckCircle2 className="size-4" />快速點名</Button></>} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="在籍學生" value={`${activeStudents.length + 116} 人`} helper="較上月淨增 6 人" trend={5.2} icon={GraduationCap} />
        <StatCard label="本月已收款" value={`$${(paidTotal + 758000).toLocaleString()}`} helper="達成月目標 86%" trend={8.4} icon={CircleDollarSign} tone="emerald" />
        <StatCard label="今日開課班級" value={`${classes.length + 4} 班`} helper="共 6 間教室使用中" icon={UsersRound} tone="sky" />
        <StatCard label="本月出席率" value={`${averageAttendance}.8%`} helper="維持優良表現" trend={1.3} icon={CheckCircle2} tone="amber" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between"><div><h2 className="font-bold text-slate-950">本週到班人次</h2><p className="mt-1 text-sm text-slate-500">每日學生到班趨勢</p></div><button type="button" className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100"><MoreHorizontal className="size-5" /></button></div>
          <div className="mt-8 flex h-52 items-end gap-3 sm:gap-5">
            {weekData.map((value, index) => <div key={weekLabels[index]} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-bold text-slate-400">{value}</span><div className="group relative w-full max-w-11 flex-1"><div className="absolute inset-x-0 bottom-0 rounded-t-lg bg-slate-200 transition group-hover:bg-slate-800" style={{ height: `${value}%` }} /></div><span className="text-xs font-semibold text-slate-500">週{weekLabels[index]}</span></div>)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-card sm:p-6">
          <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Today</p><h2 className="mt-2 text-xl font-bold">今日營運焦點</h2></div><div className="grid size-10 place-items-center rounded-xl bg-slate-800"><Clock3 className="size-5 text-slate-300" /></div></div>
          <div className="mt-6 space-y-3">
            {[['3 筆', '逾期款項待追蹤', 'text-rose-300'], ['2 位', '學生請假需安排補課', 'text-amber-300'], ['4 趟', '下午接送任務', 'text-sky-300']].map(([value, label, color]) => <div key={label} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3.5"><span className="text-sm text-slate-300">{label}</span><span className={`text-sm font-bold ${color}`}>{value}</span></div>)}
          </div>
          <Link to="/student-attendance" className="mt-5 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"><span>前往處理今日事項</span><ArrowRight className="size-4" /></Link>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-950">今日課程</h2><p className="mt-1 text-xs text-slate-500">接下來的教室安排</p></div><Link to="/schedules" className="text-xs font-bold text-slate-600 hover:text-slate-950">完整課表</Link></div>
          <div className="divide-y divide-slate-100">{schedules.slice(0, 4).map((schedule) => <div key={schedule.id} className="flex items-center gap-4 px-5 py-4"><div className="w-12 text-center"><p className="text-sm font-bold text-slate-900">{schedule.startTime}</p><p className="text-[10px] text-slate-400">{schedule.endTime}</p></div><div className="h-9 w-1 rounded-full bg-slate-800" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{schedule.className}</p><p className="mt-1 text-xs text-slate-500">{schedule.teacherName} · {schedule.classroom}</p></div><StatusBadge status="active" label="準時" /></div>)}</div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-950">接送動態</h2><p className="mt-1 text-xs text-slate-500">即時掌握學生接送狀態</p></div><Link to="/transportation" className="text-xs font-bold text-slate-600 hover:text-slate-950">查看路線</Link></div>
          <div className="divide-y divide-slate-100">{transportationTasks.slice(0, 4).map((task) => <div key={task.id} className="flex items-center gap-4 px-5 py-4"><div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><BusFront className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{task.studentName} · {task.routeName}</p><p className="mt-1 text-xs text-slate-500">{task.scheduledTime} · {task.stop}</p></div><StatusBadge status={task.status} /></div>)}</div>
        </div>
      </section>
    </div>
  );
}
