import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, Plus, Trash2, UserRound, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { DataTable, type TableColumn } from '../../components/common/DataTable';
import { FormField, SelectField } from '../../components/common/FormField';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAppDataStore } from '../../stores/useAppDataStore';
import { useUiStore } from '../../stores/useUiStore';
import type { Student } from '../../types';

const studentSchema = z.object({
  name: z.string().min(2, '請輸入至少 2 個字的姓名'),
  gender: z.enum(['男', '女']),
  grade: z.string().min(1, '請選擇年級'),
  school: z.string().min(2, '請輸入就讀學校'),
  className: z.string().min(1, '請選擇班級'),
  guardianName: z.string().min(2, '請輸入家長姓名'),
  guardianRelation: z.string().min(1, '請輸入關係'),
  guardianPhone: z.string().regex(/^09\d{8}$/, '請輸入 09 開頭的 10 碼手機號碼'),
  status: z.enum(['active', 'inactive']),
  transportation: z.boolean(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const students = useAppDataStore((state) => state.students);
  const addStudent = useAppDataStore((state) => state.addStudent);
  const removeStudent = useAppDataStore((state) => state.removeStudent);
  const showToast = useUiStore((state) => state.showToast);
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: '', gender: '女', grade: '', school: '', className: '', guardianName: '', guardianRelation: '媽媽', guardianPhone: '', status: 'active', transportation: false },
  });

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return students.filter((student) => !keyword || [student.name, student.school, student.className, student.guardian.name].some((value) => value.toLowerCase().includes(keyword)));
  }, [search, students]);

  const handleCreate = (values: StudentFormValues) => {
    addStudent({ name: values.name, gender: values.gender, grade: values.grade, school: values.school, className: values.className, guardian: { name: values.guardianName, relation: values.guardianRelation, phone: values.guardianPhone }, status: values.status, transportation: values.transportation });
    form.reset();
    setModalOpen(false);
    showToast(`已新增學生「${values.name}」`);
  };

  const columns: TableColumn<Student>[] = [
    { key: 'student', header: '學生', render: (student) => <div className="flex items-center gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">{student.name.slice(-2)}</div><div><p className="font-bold text-slate-900">{student.name}</p><p className="mt-0.5 text-xs text-slate-400">{student.id.toUpperCase()}</p></div></div> },
    { key: 'school', header: '學校／年級', render: (student) => <><p className="font-medium text-slate-700">{student.school}</p><p className="mt-1 text-xs text-slate-400">{student.grade}</p></> },
    { key: 'class', header: '所屬班級', render: (student) => student.className },
    { key: 'guardian', header: '家長聯絡', render: (student) => <><p>{student.guardian.name}（{student.guardian.relation}）</p><p className="mt-1 text-xs text-slate-400">{student.guardian.phone}</p></> },
    { key: 'attendance', header: '出席率', render: (student) => <div className="w-24"><div className="flex items-center justify-between text-xs"><span className="font-bold text-slate-700">{student.attendanceRate}%</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${student.attendanceRate}%` }} /></div></div> },
    { key: 'status', header: '狀態', render: (student) => <StatusBadge status={student.status} /> },
    { key: 'action', header: '', className: 'text-right', render: (student) => <div className="flex justify-end gap-1"><button type="button" aria-label={`刪除 ${student.name}`} onClick={() => { if (window.confirm(`確定要刪除 ${student.name} 的資料嗎？`)) { removeStudent(student.id); showToast('學生資料已刪除', 'info'); } }} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" /></button><button type="button" aria-label="更多操作" className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal className="size-4" /></button></div> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="學生資料" description="集中管理學生基本資料、家長聯絡方式、班級與接送需求。" actions={<Button onClick={() => setModalOpen(true)}><Plus className="size-4" />新增學生</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[['在籍學生', `${students.filter((student) => student.status === 'active').length + 116} 人`, UsersRound], ['本月新生', '6 人', UserRound], ['接送服務', `${students.filter((student) => student.transportation).length + 38} 人`, UsersRound]].map(([label, value, Icon]) => <div key={String(label)} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"><div className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-600"><Icon className="size-5" /></div><div><p className="text-xs font-semibold text-slate-500">{String(label)}</p><p className="mt-1 text-xl font-bold text-slate-950">{String(value)}</p></div></div>)}
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><SearchInput className="w-full sm:max-w-sm" value={search} onChange={setSearch} placeholder="搜尋姓名、學校、班級或家長" /><div className="flex gap-2"><select aria-label="篩選狀態" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"><option>全部狀態</option><option>啟用中</option><option>已停用</option></select><Button variant="secondary"><MoreHorizontal className="size-4" />更多篩選</Button></div></div>
        <DataTable data={filteredStudents} columns={columns} getRowKey={(student) => student.id} mobileTitle={(student) => student.name} emptyTitle="找不到符合的學生" emptyDescription="請調整搜尋關鍵字或新增學生資料。" />
      </section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="新增學生" description="建立學生與主要聯絡人資料。">
        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-5 p-5 sm:p-6" noValidate>
          <div className="grid gap-4 sm:grid-cols-2"><FormField label="學生姓名" placeholder="例：陳小衡" required error={form.formState.errors.name?.message} {...form.register('name')} /><SelectField label="性別" required error={form.formState.errors.gender?.message} selectProps={form.register('gender')}><option value="女">女</option><option value="男">男</option></SelectField></div>
          <div className="grid gap-4 sm:grid-cols-2"><SelectField label="年級" required error={form.formState.errors.grade?.message} selectProps={form.register('grade')}><option value="">請選擇</option><option>小五</option><option>小六</option><option>國一</option><option>國二</option><option>國三</option></SelectField><FormField label="就讀學校" placeholder="例：光明國中" required error={form.formState.errors.school?.message} {...form.register('school')} /></div>
          <SelectField label="所屬班級" required error={form.formState.errors.className?.message} selectProps={form.register('className')}><option value="">請選擇班級</option><option>小五全科班</option><option>小六全科班</option><option>國一數學 A</option><option>國二英文 A</option><option>國三會考衝刺</option></SelectField>
          <div className="border-t border-slate-100 pt-5"><h3 className="mb-4 text-sm font-bold text-slate-900">主要聯絡人</h3><div className="grid gap-4 sm:grid-cols-2"><FormField label="家長姓名" required error={form.formState.errors.guardianName?.message} {...form.register('guardianName')} /><FormField label="關係" required error={form.formState.errors.guardianRelation?.message} {...form.register('guardianRelation')} /></div><div className="mt-4"><FormField label="手機號碼" placeholder="0912345678" inputMode="tel" required error={form.formState.errors.guardianPhone?.message} {...form.register('guardianPhone')} /></div></div>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"><input type="checkbox" className="size-4 rounded accent-slate-900" {...form.register('transportation')} /><span><span className="block text-sm font-bold text-slate-800">需要接送服務</span><span className="mt-0.5 block text-xs text-slate-500">之後可於接送安排中設定路線與站點。</span></span></label>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5"><Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>取消</Button><Button type="submit">建立學生資料</Button></div>
        </form>
      </Modal>
    </div>
  );
}
