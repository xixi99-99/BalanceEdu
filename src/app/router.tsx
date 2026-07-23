/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { AttendanceRecordsPage } from '../features/attendance-records/AttendanceRecordsPage';
import { LoginPage } from '../features/auth/LoginPage';
import { ClassesPage } from '../features/classes/ClassesPage';
import { CommunicationBookPage } from '../features/communication-book/CommunicationBookPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { FinancePage } from '../features/finance/FinancePage';
import { MakeupClassesPage } from '../features/makeup-classes/MakeupClassesPage';
import { SchedulesPage } from '../features/schedules/SchedulesPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { StaffPage } from '../features/staff/StaffPage';
import { StudentAttendancePage } from '../features/student-attendance/StudentAttendancePage';
import { StudentsPage } from '../features/students/StudentsPage';
import { TeacherAttendancePage } from '../features/teacher-attendance/TeacherAttendancePage';
import { TransportationPage } from '../features/transportation/TransportationPage';
import { useAuthStore } from '../stores/useAuthStore';
import type { UserRole } from '../types';

const allRoles: UserRole[] = ['system-admin', 'administrator', 'teacher', 'driver'];
const managementRoles: UserRole[] = ['system-admin', 'administrator'];
const teachingRoles: UserRole[] = ['system-admin', 'administrator', 'teacher'];

function ProtectedShell() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />;
}

function LoginRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

function RoleRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const role = useAuthStore((state) => state.user?.role);
  return role && roles.includes(role) ? children : <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginRoute /> },
  { path: '/', element: <ProtectedShell />, children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    { path: 'dashboard', element: <RoleRoute roles={allRoles}><DashboardPage /></RoleRoute> },
    { path: 'students', element: <RoleRoute roles={teachingRoles}><StudentsPage /></RoleRoute> },
    { path: 'student-attendance', element: <RoleRoute roles={teachingRoles}><StudentAttendancePage /></RoleRoute> },
    { path: 'makeup-classes', element: <RoleRoute roles={managementRoles}><MakeupClassesPage /></RoleRoute> },
    { path: 'finance', element: <RoleRoute roles={managementRoles}><FinancePage /></RoleRoute> },
    { path: 'staff', element: <RoleRoute roles={['system-admin']}><StaffPage /></RoleRoute> },
    { path: 'schedules', element: <RoleRoute roles={managementRoles}><SchedulesPage /></RoleRoute> },
    { path: 'my-schedule', element: <RoleRoute roles={['teacher']}><SchedulesPage /></RoleRoute> },
    { path: 'classes', element: <RoleRoute roles={teachingRoles}><ClassesPage /></RoleRoute> },
    { path: 'transportation', element: <RoleRoute roles={allRoles}><TransportationPage /></RoleRoute> },
    { path: 'teacher-attendance', element: <RoleRoute roles={managementRoles}><TeacherAttendancePage /></RoleRoute> },
    { path: 'attendance-records', element: <RoleRoute roles={managementRoles}><AttendanceRecordsPage /></RoleRoute> },
    { path: 'communication-book', element: <RoleRoute roles={teachingRoles}><CommunicationBookPage /></RoleRoute> },
    { path: 'settings', element: <RoleRoute roles={['system-admin']}><SettingsPage /></RoleRoute> },
    { path: '*', element: <Navigate to="/dashboard" replace /> },
  ] },
]);
