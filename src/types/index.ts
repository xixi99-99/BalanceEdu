export type UserRole = 'system-admin' | 'administrator' | 'teacher' | 'driver';

export type EntityStatus = 'active' | 'inactive';
export type AttendanceStatus = 'present' | 'late' | 'leave' | 'absent';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'refunded';
export type MakeupClassStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';
export type TransportationStatus = 'waiting' | 'picked-up' | 'arrived' | 'absent';
export type CommunicationPostType = 'announcement' | 'homework' | 'activity' | 'reminder';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Guardian {
  name: string;
  relation: string;
  phone: string;
}

export interface Student {
  id: string;
  name: string;
  gender: '男' | '女';
  grade: string;
  school: string;
  className: string;
  guardian: Guardian;
  attendanceRate: number;
  status: EntityStatus;
  transportation: boolean;
  joinedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  title: string;
  role: UserRole;
  phone: string;
  email: string;
  workStatus: EntityStatus;
  attendanceRate: number;
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  note: string;
}

export interface TeacherAttendance {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  workHours: number;
}

export interface MakeupClass {
  id: string;
  studentName: string;
  courseName: string;
  originalDate: string;
  scheduledDate: string;
  teacherName: string;
  status: MakeupClassStatus;
}

export interface Payment {
  id: string;
  studentName: string;
  item: string;
  amount: number;
  dueDate: string;
  paidAt: string;
  status: PaymentStatus;
  method: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  subject: string;
  grade: string;
  teacherName: string;
  classroom: string;
  studentCount: number;
  capacity: number;
  schedule: string;
  status: EntityStatus;
}

export interface ScheduleEntry {
  id: string;
  className: string;
  subject: string;
  teacherName: string;
  classroom: string;
  weekday: number;
  startTime: string;
  endTime: string;
  color: 'slate' | 'sky' | 'emerald' | 'amber';
}

export interface TransportationTask {
  id: string;
  studentName: string;
  routeName: string;
  driverName: string;
  stop: string;
  scheduledTime: string;
  guardianPhone: string;
  status: TransportationStatus;
  direction: 'pickup' | 'dropoff';
}

export interface CommunicationPost {
  id: string;
  title: string;
  content: string;
  className: string;
  author: string;
  publishedAt: string;
  type: CommunicationPostType;
  readCount: number;
  totalRecipients: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
