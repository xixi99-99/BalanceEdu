import type {
  ClassGroup,
  CommunicationPost,
  MakeupClass,
  Payment,
  ScheduleEntry,
  Staff,
  Student,
  StudentAttendance,
  TeacherAttendance,
  TransportationTask,
  User,
  UserRole,
} from '../types';

export const roleLabels: Record<UserRole, string> = {
  'system-admin': '系統管理員',
  administrator: '行政人員',
  teacher: '教師',
  driver: '接送人員',
};

export const demoUsers: Record<UserRole, User> = {
  'system-admin': { id: 'u1', name: '林育成', email: 'admin@balance.edu.tw', role: 'system-admin' },
  administrator: { id: 'u2', name: '許雅雯', email: 'office@balance.edu.tw', role: 'administrator' },
  teacher: { id: 'u3', name: '陳思妤', email: 'teacher@balance.edu.tw', role: 'teacher' },
  driver: { id: 'u4', name: '王志明', email: 'driver@balance.edu.tw', role: 'driver' },
};

const studentSeed: Array<[string, '男' | '女', string, string, string, string, string, number, boolean]> = [
  ['陳品妍', '女', '國一', '光明國中', '國一數學 A', '陳俊宏', '爸爸', 98, true],
  ['林冠宇', '男', '國二', '明德國中', '國二英文 A', '林雅芬', '媽媽', 94, false],
  ['張芷晴', '女', '小六', '仁愛國小', '小六全科班', '張文豪', '爸爸', 100, true],
  ['黃柏翰', '男', '國三', '中正國中', '國三會考衝刺', '黃淑慧', '媽媽', 91, false],
  ['吳佳穎', '女', '國一', '光明國中', '國一數學 A', '吳志強', '爸爸', 96, true],
  ['李承恩', '男', '小五', '仁愛國小', '小五全科班', '李佩珊', '媽媽', 89, true],
  ['周語彤', '女', '國二', '育英國中', '國二英文 A', '周家豪', '爸爸', 97, false],
  ['蔡昀哲', '男', '國三', '中正國中', '國三會考衝刺', '蔡慧玲', '媽媽', 93, true],
  ['鄭羽柔', '女', '小六', '光華國小', '小六全科班', '鄭建國', '爸爸', 99, false],
  ['劉彥廷', '男', '國一', '育英國中', '國一數學 A', '劉芳瑜', '媽媽', 87, true],
  ['徐安琪', '女', '小五', '仁愛國小', '小五全科班', '徐國華', '爸爸', 95, false],
  ['楊子謙', '男', '國二', '明德國中', '國二英文 A', '楊美玲', '媽媽', 92, true],
];

export const initialStudents: Student[] = studentSeed.map((item, index) => ({
  id: `stu-${index + 1}`,
  name: item[0],
  gender: item[1],
  grade: item[2],
  school: item[3],
  className: item[4],
  guardian: { name: item[5], relation: item[6], phone: `09${String(12003400 + index * 317).padStart(8, '0')}` },
  attendanceRate: item[7],
  status: index === 9 ? 'inactive' : 'active',
  transportation: item[8],
  joinedAt: `202${4 + (index % 2)}-${String((index % 9) + 1).padStart(2, '0')}-15`,
}));

export const initialStaff: Staff[] = [
  { id: 'stf-1', name: '陳思妤', title: '數學教師', role: 'teacher', phone: '0912-345-671', email: 'siyu@balance.edu.tw', workStatus: 'active', attendanceRate: 98 },
  { id: 'stf-2', name: '張書豪', title: '英文教師', role: 'teacher', phone: '0922-118-365', email: 'shuhao@balance.edu.tw', workStatus: 'active', attendanceRate: 96 },
  { id: 'stf-3', name: '許雅雯', title: '行政主任', role: 'administrator', phone: '0933-710-288', email: 'office@balance.edu.tw', workStatus: 'active', attendanceRate: 99 },
  { id: 'stf-4', name: '王志明', title: '接送司機', role: 'driver', phone: '0988-231-509', email: 'driver@balance.edu.tw', workStatus: 'active', attendanceRate: 97 },
  { id: 'stf-5', name: '趙雅婷', title: '自然教師', role: 'teacher', phone: '0966-430-125', email: 'yating@balance.edu.tw', workStatus: 'active', attendanceRate: 95 },
  { id: 'stf-6', name: '郭建宏', title: '課輔老師', role: 'teacher', phone: '0955-614-730', email: 'jianhong@balance.edu.tw', workStatus: 'inactive', attendanceRate: 92 },
];

export const initialStudentAttendance: StudentAttendance[] = initialStudents.slice(0, 8).map((student, index) => ({
  id: `att-${index + 1}`,
  studentId: student.id,
  studentName: student.name,
  className: student.className,
  date: '2026-07-21',
  status: index === 3 ? 'leave' : index === 6 ? 'late' : 'present',
  checkIn: index === 3 ? '—' : index === 6 ? '17:12' : `16:${String(42 + index).padStart(2, '0')}`,
  checkOut: '—',
  note: index === 3 ? '家長事前請假' : index === 6 ? '交通壅塞' : '',
}));

export const initialTeacherAttendance: TeacherAttendance[] = initialStaff.slice(0, 5).map((staff, index) => ({
  id: `tatt-${index + 1}`,
  staffId: staff.id,
  staffName: staff.name,
  date: '2026-07-21',
  status: index === 4 ? 'late' : 'present',
  checkIn: index === 4 ? '13:12' : `12:${String(45 + index).padStart(2, '0')}`,
  checkOut: index < 2 ? '21:05' : '—',
  workHours: index < 2 ? 8.1 : 4.5,
}));

export const initialMakeupClasses: MakeupClass[] = [
  { id: 'mk-1', studentName: '黃柏翰', courseName: '國三數學', originalDate: '2026-07-18', scheduledDate: '2026-07-23 18:30', teacherName: '陳思妤', status: 'scheduled' },
  { id: 'mk-2', studentName: '劉彥廷', courseName: '國一數學', originalDate: '2026-07-19', scheduledDate: '尚未安排', teacherName: '陳思妤', status: 'pending' },
  { id: 'mk-3', studentName: '周語彤', courseName: '國二英文', originalDate: '2026-07-15', scheduledDate: '2026-07-20 14:00', teacherName: '張書豪', status: 'completed' },
  { id: 'mk-4', studentName: '李承恩', courseName: '小五自然', originalDate: '2026-07-17', scheduledDate: '2026-07-24 16:00', teacherName: '趙雅婷', status: 'scheduled' },
];

export const initialPayments: Payment[] = [
  { id: 'pay-1', studentName: '陳品妍', item: '七月份月費', amount: 6800, dueDate: '2026-07-05', paidAt: '2026-07-02', status: 'paid', method: '信用卡' },
  { id: 'pay-2', studentName: '林冠宇', item: '七月份月費', amount: 7200, dueDate: '2026-07-05', paidAt: '2026-07-04', status: 'paid', method: '轉帳' },
  { id: 'pay-3', studentName: '張芷晴', item: '暑期教材費', amount: 1850, dueDate: '2026-07-12', paidAt: '', status: 'overdue', method: '—' },
  { id: 'pay-4', studentName: '黃柏翰', item: '暑期衝刺班', amount: 12800, dueDate: '2026-07-25', paidAt: '', status: 'pending', method: '—' },
  { id: 'pay-5', studentName: '吳佳穎', item: '七月份月費', amount: 6800, dueDate: '2026-07-05', paidAt: '2026-07-03', status: 'paid', method: '現金' },
  { id: 'pay-6', studentName: '李承恩', item: '接送服務費', amount: 2200, dueDate: '2026-07-10', paidAt: '2026-07-08', status: 'paid', method: '轉帳' },
];

export const initialClasses: ClassGroup[] = [
  { id: 'cls-1', name: '國一數學 A', subject: '數學', grade: '國一', teacherName: '陳思妤', classroom: '201 教室', studentCount: 18, capacity: 20, schedule: '週一、三 18:30', status: 'active' },
  { id: 'cls-2', name: '國二英文 A', subject: '英文', grade: '國二', teacherName: '張書豪', classroom: '305 教室', studentCount: 16, capacity: 18, schedule: '週二、四 18:30', status: 'active' },
  { id: 'cls-3', name: '小六全科班', subject: '全科', grade: '小六', teacherName: '郭建宏', classroom: '102 教室', studentCount: 14, capacity: 16, schedule: '週一至五 16:30', status: 'active' },
  { id: 'cls-4', name: '國三會考衝刺', subject: '全科', grade: '國三', teacherName: '陳思妤', classroom: '301 教室', studentCount: 20, capacity: 20, schedule: '週六、日 09:00', status: 'active' },
];

export const initialSchedules: ScheduleEntry[] = [
  { id: 'sch-1', className: '國一數學 A', subject: '數學', teacherName: '陳思妤', classroom: '201 教室', weekday: 1, startTime: '18:30', endTime: '20:00', color: 'slate' },
  { id: 'sch-2', className: '小六全科班', subject: '課輔', teacherName: '郭建宏', classroom: '102 教室', weekday: 1, startTime: '16:30', endTime: '18:00', color: 'emerald' },
  { id: 'sch-3', className: '國二英文 A', subject: '英文', teacherName: '張書豪', classroom: '305 教室', weekday: 2, startTime: '18:30', endTime: '20:00', color: 'sky' },
  { id: 'sch-4', className: '國一數學 A', subject: '數學', teacherName: '陳思妤', classroom: '201 教室', weekday: 3, startTime: '18:30', endTime: '20:00', color: 'slate' },
  { id: 'sch-5', className: '自然實驗班', subject: '自然', teacherName: '趙雅婷', classroom: '實驗教室', weekday: 3, startTime: '16:30', endTime: '18:00', color: 'amber' },
  { id: 'sch-6', className: '國二英文 A', subject: '英文', teacherName: '張書豪', classroom: '305 教室', weekday: 4, startTime: '18:30', endTime: '20:00', color: 'sky' },
  { id: 'sch-7', className: '國三會考衝刺', subject: '全科', teacherName: '陳思妤', classroom: '301 教室', weekday: 6, startTime: '09:00', endTime: '12:00', color: 'emerald' },
];

export const initialTransportationTasks: TransportationTask[] = [
  { id: 'tr-1', studentName: '陳品妍', routeName: '東區一線', driverName: '王志明', stop: '光明國中正門', scheduledTime: '16:15', guardianPhone: '0912-003-400', status: 'arrived', direction: 'pickup' },
  { id: 'tr-2', studentName: '張芷晴', routeName: '南區二線', driverName: '王志明', stop: '仁愛國小側門', scheduledTime: '16:25', guardianPhone: '0912-004-034', status: 'picked-up', direction: 'pickup' },
  { id: 'tr-3', studentName: '吳佳穎', routeName: '東區一線', driverName: '王志明', stop: '光明國中正門', scheduledTime: '16:20', guardianPhone: '0912-004-668', status: 'waiting', direction: 'pickup' },
  { id: 'tr-4', studentName: '李承恩', routeName: '南區二線', driverName: '王志明', stop: '仁愛國小側門', scheduledTime: '16:28', guardianPhone: '0912-004-985', status: 'waiting', direction: 'pickup' },
  { id: 'tr-5', studentName: '蔡昀哲', routeName: '西區三線', driverName: '王志明', stop: '中正國中後門', scheduledTime: '16:45', guardianPhone: '0912-005-619', status: 'waiting', direction: 'pickup' },
];

export const initialCommunicationPosts: CommunicationPost[] = [
  { id: 'post-1', title: '七月份第二次模擬考提醒', content: '本週六上午 9:00 舉行國三模擬考，請準時到班並攜帶 2B 鉛筆。', className: '國三會考衝刺', author: '陳思妤', publishedAt: '2026-07-21 10:30', type: 'reminder', readCount: 18, totalRecipients: 20 },
  { id: 'post-2', title: '暑期戶外科學營行前通知', content: '請於活動當日上午 8:10 前至一樓大廳集合，並自備水壺與帽子。', className: '全班級', author: '許雅雯', publishedAt: '2026-07-20 16:15', type: 'activity', readCount: 83, totalRecipients: 96 },
  { id: 'post-3', title: '本週英文作業', content: '完成講義 Unit 6 第 12 至 18 頁，下次上課進行單字小考。', className: '國二英文 A', author: '張書豪', publishedAt: '2026-07-19 20:05', type: 'homework', readCount: 15, totalRecipients: 16 },
];
