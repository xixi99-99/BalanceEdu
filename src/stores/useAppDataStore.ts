import { create } from 'zustand';
import {
  initialClasses,
  initialCommunicationPosts,
  initialMakeupClasses,
  initialPayments,
  initialSchedules,
  initialStaff,
  initialStudentAttendance,
  initialStudents,
  initialTeacherAttendance,
  initialTransportationTasks,
} from '../mock/data';
import type {
  AttendanceStatus,
  ClassGroup,
  CommunicationPost,
  MakeupClass,
  Payment,
  ScheduleEntry,
  Staff,
  Student,
  StudentAttendance,
  TeacherAttendance,
  TransportationStatus,
  TransportationTask,
} from '../types';

interface AppDataState {
  students: Student[];
  staff: Staff[];
  studentAttendance: StudentAttendance[];
  teacherAttendance: TeacherAttendance[];
  makeupClasses: MakeupClass[];
  payments: Payment[];
  classes: ClassGroup[];
  schedules: ScheduleEntry[];
  transportationTasks: TransportationTask[];
  communicationPosts: CommunicationPost[];
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'joinedAt'>) => void;
  removeStudent: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'paidAt'>) => void;
  addPost: (post: Omit<CommunicationPost, 'id' | 'publishedAt' | 'readCount'>) => void;
  setStudentAttendance: (id: string, status: AttendanceStatus) => void;
  setTransportationStatus: (id: string, status: TransportationStatus) => void;
}

export const useAppDataStore = create<AppDataState>((set) => ({
  students: initialStudents,
  staff: initialStaff,
  studentAttendance: initialStudentAttendance,
  teacherAttendance: initialTeacherAttendance,
  makeupClasses: initialMakeupClasses,
  payments: initialPayments,
  classes: initialClasses,
  schedules: initialSchedules,
  transportationTasks: initialTransportationTasks,
  communicationPosts: initialCommunicationPosts,
  addStudent: (student) => set((state) => ({
    students: [
      { ...student, id: `stu-${Date.now()}`, attendanceRate: 100, joinedAt: new Date().toISOString().slice(0, 10) },
      ...state.students,
    ],
  })),
  removeStudent: (id) => set((state) => ({ students: state.students.filter((student) => student.id !== id) })),
  addPayment: (payment) => set((state) => ({
    payments: [{ ...payment, id: `pay-${Date.now()}`, paidAt: payment.status === 'paid' ? new Date().toISOString().slice(0, 10) : '' }, ...state.payments],
  })),
  addPost: (post) => set((state) => ({
    communicationPosts: [
      { ...post, id: `post-${Date.now()}`, publishedAt: new Date().toLocaleString('zh-TW', { hour12: false }), readCount: 0 },
      ...state.communicationPosts,
    ],
  })),
  setStudentAttendance: (id, status) => set((state) => ({
    studentAttendance: state.studentAttendance.map((record) => record.id === id ? { ...record, status } : record),
  })),
  setTransportationStatus: (id, status) => set((state) => ({
    transportationTasks: state.transportationTasks.map((task) => task.id === id ? { ...task, status } : task),
  })),
}));
