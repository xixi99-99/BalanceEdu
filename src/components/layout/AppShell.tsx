import {
  Bell, BookOpenCheck, BusFront, CalendarClock, ChevronLeft, ChevronRight, CircleDollarSign,
  ClipboardCheck, GraduationCap, LayoutDashboard, Menu, MessageSquareText, Search, Settings,
  ShieldCheck, UserRoundCheck, Users, UsersRound, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { roleLabels } from '../../mock/data';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUiStore } from '../../stores/useUiStore';
import type { UserRole } from '../../types';
import { Toast } from '../feedback/Toast';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const allRoles: UserRole[] = ['system-admin', 'administrator', 'teacher', 'driver'];
const managementRoles: UserRole[] = ['system-admin', 'administrator'];
const teachingRoles: UserRole[] = ['system-admin', 'administrator', 'teacher'];

const navGroups: NavGroup[] = [
  { label: '總覽', items: [{ label: '營運儀表板', path: '/dashboard', icon: LayoutDashboard, roles: allRoles }] },
  { label: '學生營運', items: [
    { label: '學生資料', path: '/students', icon: GraduationCap, roles: teachingRoles },
    { label: '學生出缺勤', path: '/student-attendance', icon: ClipboardCheck, roles: teachingRoles },
    { label: '補課管理', path: '/makeup-classes', icon: CalendarClock, roles: managementRoles },
  ] },
  { label: '教務管理', items: [
    { label: '班級管理', path: '/classes', icon: UsersRound, roles: teachingRoles },
    { label: '課表管理', path: '/schedules', icon: BookOpenCheck, roles: managementRoles },
    { label: '我的課表', path: '/my-schedule', icon: BookOpenCheck, roles: ['teacher'] },
  ] },
  { label: '行政管理', items: [
    { label: '財務管理', path: '/finance', icon: CircleDollarSign, roles: managementRoles },
    { label: '教職員管理', path: '/staff', icon: Users, roles: ['system-admin'] },
    { label: '教師出缺勤', path: '/teacher-attendance', icon: UserRoundCheck, roles: managementRoles },
    { label: '出勤紀錄', path: '/attendance-records', icon: ShieldCheck, roles: managementRoles },
  ] },
  { label: '服務與溝通', items: [
    { label: '接送安排', path: '/transportation', icon: BusFront, roles: allRoles },
    { label: '電子聯絡簿', path: '/communication-book', icon: MessageSquareText, roles: teachingRoles },
  ] },
  { label: '系統', items: [{ label: '系統設定', path: '/settings', icon: Settings, roles: ['system-admin'] }] },
];

const pageTitles: Record<string, string> = {
  '/dashboard': '營運儀表板', '/students': '學生資料', '/student-attendance': '學生出缺勤',
  '/makeup-classes': '補課管理', '/finance': '財務管理', '/staff': '教職員管理',
  '/schedules': '課表管理', '/my-schedule': '我的課表', '/classes': '班級管理',
  '/transportation': '接送安排', '/teacher-attendance': '教師出缺勤',
  '/attendance-records': '出勤紀錄', '/communication-book': '電子聯絡簿', '/settings': '系統設定',
};

function isUserRole(value: string): value is UserRole {
  return value === 'system-admin' || value === 'administrator' || value === 'teacher' || value === 'driver';
}

interface SidebarContentProps {
  collapsed: boolean;
  role: UserRole;
  onNavigate?: () => void;
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('flex h-[73px] items-center border-b border-slate-800 px-5', collapsed && 'justify-center px-2')}>
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-sm font-black text-slate-950 shadow-sm">衡</div>
      {!collapsed && <div className="ml-3 min-w-0"><p className="truncate font-bold tracking-wide text-white">衡學管理平台</p><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">BalanceEdu</p></div>}
    </div>
  );
}

function SidebarContent({ collapsed, role, onNavigate }: SidebarContentProps) {
  return (
    <>
      <Brand collapsed={collapsed} />
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => {
          const items = group.items.filter((item) => item.roles.includes(role));
          if (items.length === 0) return null;
          return (
            <div key={group.label} className="mb-6">
              {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{group.label}</p>}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.path} to={item.path} onClick={onNavigate} title={collapsed ? item.label : undefined} className={({ isActive }) => cn('group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition', isActive ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white', collapsed && 'justify-center px-0')}>
                      <Icon className="size-[18px] shrink-0" strokeWidth={1.9} />{!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      {!collapsed && <div className="m-3 rounded-2xl border border-slate-700 bg-slate-800 p-3.5"><div className="flex items-center gap-2 text-xs font-bold text-white"><ShieldCheck className="size-4 text-emerald-400" />系統運作正常</div><p className="mt-1.5 text-[11px] leading-5 text-slate-400">資料於本機模擬，最後同步於剛剛。</p></div>}
    </>
  );
}

export function AppShell() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const switchRole = useAuthStore((state) => state.switchRole);
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const mobileDrawerOpen = useUiStore((state) => state.mobileDrawerOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setMobileDrawerOpen = useUiStore((state) => state.setMobileDrawerOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role ?? 'administrator';
  const visibleItems = useMemo(() => navGroups.flatMap((group) => group.items).filter((item) => item.roles.includes(role)), [role]);
  const bottomItems = role === 'driver' ? visibleItems.filter((item) => ['/dashboard', '/transportation'].includes(item.path)) : visibleItems.filter((item) => ['/dashboard', '/students', '/student-attendance', '/communication-book'].includes(item.path)).slice(0, 4);

  const handleRoleChange = (value: string) => {
    if (isUserRole(value)) {
      switchRole(value);
      const firstPath = navGroups.flatMap((group) => group.items).find((item) => item.roles.includes(value))?.path ?? '/dashboard';
      navigate(firstPath);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className={cn('fixed inset-y-0 left-0 z-40 hidden flex-col bg-slate-950 transition-[width] duration-300 lg:flex', sidebarCollapsed ? 'w-[76px]' : 'w-[250px]')}>
        <SidebarContent collapsed={sidebarCollapsed} role={role} />
        <button type="button" onClick={toggleSidebar} aria-label={sidebarCollapsed ? '展開側邊欄' : '收合側邊欄'} className="absolute -right-3 top-24 grid size-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md hover:text-slate-900">
          {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </aside>

      {mobileDrawerOpen && <button type="button" aria-label="關閉選單" className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileDrawerOpen(false)} />}
      <aside className={cn('fixed inset-y-0 left-0 z-[60] flex w-[290px] flex-col bg-slate-950 transition-transform duration-300 lg:hidden', mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full')}>
        <button type="button" aria-label="關閉選單" className="absolute right-3 top-5 grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => setMobileDrawerOpen(false)}><X className="size-5" /></button>
        <SidebarContent collapsed={false} role={role} onNavigate={() => setMobileDrawerOpen(false)} />
      </aside>

      <div className={cn('min-h-screen transition-[margin] duration-300', sidebarCollapsed ? 'lg:ml-[76px]' : 'lg:ml-[250px]')}>
        <header className="sticky top-0 z-30 flex h-[73px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setMobileDrawerOpen(true)} className="mr-3 grid size-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="開啟選單"><Menu className="size-5" /></button>
          <div className="min-w-0 flex-1"><p className="truncate text-base font-bold text-slate-950 sm:text-lg">{pageTitles[location.pathname] ?? '衡學管理平台'}</p><p className="hidden text-xs text-slate-400 sm:block">2026 年 7 月 21 日，星期二</p></div>
          <div className="hidden w-full max-w-xs md:block">
            <label className="relative block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input aria-label="全站搜尋" placeholder="搜尋學生、班級或功能" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100" /></label>
          </div>
          <button type="button" className="relative mx-2 grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100" aria-label="通知"><Bell className="size-5" /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-rose-500" /></button>
          <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
            <div className="grid size-9 place-items-center rounded-xl bg-slate-900 text-xs font-bold text-white">{user?.name.slice(-2) ?? '使用'}</div>
            <div className="hidden xl:block"><p className="text-sm font-bold text-slate-800">{user?.name}</p><p className="text-[11px] text-slate-400">{roleLabels[role]}</p></div>
            <select aria-label="切換示範角色" value={role} onChange={(event) => handleRoleChange(event.target.value)} className="h-9 max-w-24 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none hover:border-slate-300">
              {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button type="button" onClick={() => { logout(); navigate('/login'); }} className="hidden text-xs font-semibold text-slate-400 hover:text-rose-600 2xl:block">登出</button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:pb-10 xl:px-8"><Outlet /></main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {bottomItems.map((item) => { const Icon = item.icon; return <NavLink key={item.path} to={item.path} className={({ isActive }) => cn('flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold', isActive ? 'text-slate-950' : 'text-slate-400')}><Icon className="size-5" /><span>{item.label.replace('管理', '')}</span></NavLink>; })}
        </div>
      </nav>
      <Toast />
    </div>
  );
}
