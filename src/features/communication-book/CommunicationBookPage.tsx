import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpenText, Eye, Heart, MessageCircle, PenLine, Plus, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { FormField, SelectField } from '../../components/common/FormField';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAppDataStore } from '../../stores/useAppDataStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUiStore } from '../../stores/useUiStore';

const postSchema = z.object({
  title: z.string().min(4, '標題至少需要 4 個字').max(60, '標題不得超過 60 個字'),
  content: z.string().min(10, '內容至少需要 10 個字').max(600, '內容不得超過 600 個字'),
  className: z.string().min(1, '請選擇發布班級'),
  type: z.enum(['announcement', 'homework', 'activity', 'reminder']),
  totalRecipients: z.number().min(1),
});

type PostFormValues = z.infer<typeof postSchema>;

export function CommunicationBookPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<'posts' | 'homework'>('posts');
  const posts = useAppDataStore((state) => state.communicationPosts);
  const addPost = useAppDataStore((state) => state.addPost);
  const user = useAuthStore((state) => state.user);
  const showToast = useUiStore((state) => state.showToast);
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', content: '', className: '全班級', type: 'announcement', totalRecipients: 96 },
  });
  const submitPost = (values: PostFormValues) => {
    addPost({ ...values, author: user?.name ?? '系統管理員' });
    form.reset();
    setModalOpen(false);
    showToast('聯絡簿貼文已發布');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="電子聯絡簿" description="發布班級公告、作業與活動提醒，並追蹤家長閱讀情形。" actions={<Button onClick={() => setModalOpen(true)}><Plus className="size-4" />新增貼文</Button>} />
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => setTab('posts')} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === 'posts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>聯絡事項</button><button type="button" onClick={() => setTab('homework')} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${tab === 'homework' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>作業／評量</button></div>
        <div className="flex gap-2"><select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600"><option>全部班級</option><option>國一數學 A</option><option>國二英文 A</option></select><Button variant="secondary" size="sm"><BookOpenText className="size-4" />草稿</Button></div>
      </div>
      <section className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <div className="space-y-4">{posts.filter((post) => tab === 'posts' || post.type === 'homework').map((post) => <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-xs font-bold text-white">{post.author.slice(-2)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-slate-900">{post.author}</p><StatusBadge status={post.type} /></div><p className="mt-1 text-xs text-slate-400">{post.publishedAt} · {post.className}</p></div></div><h2 className="mt-5 text-lg font-bold text-slate-950">{post.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{post.content}</p><div className="mt-5 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4 text-xs text-slate-400"><span className="flex items-center gap-1.5"><Eye className="size-4" />已讀 {post.readCount}/{post.totalRecipients}</span><span className="flex items-center gap-1.5"><Heart className="size-4" />{Math.max(3, Math.round(post.readCount / 4))}</span><span className="flex items-center gap-1.5"><MessageCircle className="size-4" />{Math.max(1, Math.round(post.readCount / 12))}</span><button type="button" className="ml-auto font-bold text-slate-600 hover:text-slate-950">查看閱讀名單</button></div></article>)}</div>
        <aside className="space-y-4"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><h3 className="font-bold text-slate-900">閱讀概況</h3><div className="mt-5 grid place-items-center"><div className="relative grid size-32 place-items-center rounded-full" style={{ background: 'conic-gradient(#0f172a 0 86%, #e2e8f0 86% 100%)' }}><div className="grid size-24 place-items-center rounded-full bg-white text-center"><div><p className="text-2xl font-bold">86%</p><p className="text-[10px] text-slate-400">平均已讀率</p></div></div></div></div><div className="mt-5 space-y-2 text-xs"><div className="flex justify-between"><span className="text-slate-500">已閱讀家長</span><span className="font-bold text-slate-900">83 人</span></div><div className="flex justify-between"><span className="text-slate-500">尚未閱讀</span><span className="font-bold text-amber-600">13 人</span></div></div></div><div className="rounded-2xl bg-slate-950 p-5 text-white"><PenLine className="size-5 text-slate-400" /><h3 className="mt-4 font-bold">發布小提醒</h3><p className="mt-2 text-xs leading-5 text-slate-400">簡短清楚的標題與明確截止日期，能有效提高家長閱讀與回覆率。</p></div></aside>
      </section>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="新增聯絡簿貼文" description="發布後會顯示於所選班級的家長端。">
        <form onSubmit={form.handleSubmit(submitPost)} className="space-y-5 p-5 sm:p-6" noValidate>
          <FormField label="貼文標題" placeholder="輸入清楚、簡短的標題" required error={form.formState.errors.title?.message} {...form.register('title')} />
          <div className="grid gap-4 sm:grid-cols-2"><SelectField label="貼文類型" required error={form.formState.errors.type?.message} selectProps={form.register('type')}><option value="announcement">公告</option><option value="homework">作業</option><option value="activity">活動</option><option value="reminder">提醒</option></SelectField><SelectField label="發布班級" required error={form.formState.errors.className?.message} selectProps={form.register('className')}><option>全班級</option><option>國一數學 A</option><option>國二英文 A</option><option>國三會考衝刺</option></SelectField></div>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">貼文內容<span className="ml-1 text-rose-600">*</span></span><textarea rows={6} placeholder="輸入公告、作業或提醒內容…" className={`w-full resize-none rounded-xl border bg-white p-3.5 text-sm leading-6 outline-none transition focus:ring-4 ${form.formState.errors.content ? 'border-rose-400 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'}`} {...form.register('content')} />{form.formState.errors.content && <span className="mt-1.5 block text-xs font-medium text-rose-600">{form.formState.errors.content.message}</span>}</label>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5"><Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>儲存草稿</Button><Button type="submit"><Send className="size-4" />發布貼文</Button></div>
        </form>
      </Modal>
    </div>
  );
}
