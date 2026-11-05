'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import { 
  getTasks, 
  updateTaskStatus,
} from '@/lib/api';
import type { Task } from '@/lib/types';
import { getNextStatus } from '@/lib/types';
import MixedFontText from '@/components/MixedFontText';

export default function TaskList() {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const fetchedTasks = await getTasks();
      return fetchedTasks;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, newStatus }: { taskId: number; newStatus: 'TODO' | 'DONE' | 'EXPIRED' }) =>
      updateTaskStatus(taskId, newStatus),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
    },
  });

  const handleStatusClick = (task: Task) => {
    if (updateStatusMutation.isPending) return;
    const nextStatus = getNextStatus(task.status);
    updateStatusMutation.mutate({
      taskId: task.id,
      newStatus: nextStatus,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US');
  };

  const getStatusColorClasses = (status: 'TODO' | 'DONE' | 'EXPIRED') => {
    switch (status) {
      case 'TODO': return 'bg-warning-bg text-warning';
      case 'DONE': return 'bg-success-bg text-success';
      case 'EXPIRED': return 'bg-error-bg text-error';
      default: return 'bg-warning-bg text-warning';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-text mb-4">{t('task.list.heading')}</h2>
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ms-3 text-text-muted">{t('task.list.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-text mb-4">{t('task.list.heading')}</h2>
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-center">
          {t('task.list.error')}
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-text mb-4">
          {t('task.list.headingWithCount', { count: formatNumber(0) })}
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-text-muted text-lg">{t('task.list.empty')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-text mb-4">
        {t('task.list.headingWithCount', { count: formatNumber(tasks.length) })}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">{t('task.columns.id')}</th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">{t('task.columns.title')}</th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">{t('task.columns.description')}</th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">{t('task.columns.status')}</th>
              <th className="text-start py-3 px-4 text-sm font-medium text-text-muted">{t('task.columns.createdAt')}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: Task) => (
              <tr key={task.id} className="border-b border-border hover:bg-primary-soft/50 transition-colors">
                {/* شناسه */}
                <td className="py-3 px-4 text-sm text-text">
                  {formatNumber(task.id)}
                </td>
                
                {/* عنوان */}
                <td className="py-3 px-4 text-sm font-medium text-text">
                  <div className="flex justify-start w-full">
                    <MixedFontText text={task.title} />
                  </div>
                </td>
                
                {/* توضیحات */}
                <td className="py-3 px-4 text-sm text-text-muted">
                  <div className="flex justify-start w-full">
                    <MixedFontText 
                      text={task.description || t('task.noDescription')} 
                    />
                  </div>
                </td>
                
                {/* وضعیت */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleStatusClick(task)}
                    disabled={updateStatusMutation.isPending}
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 active:scale-95 transition-all ${getStatusColorClasses(task.status)}`}
                    title={t('task.statusHint')}
                  >
                    {t(`task.status.${task.status}`)}
                  </button>
                </td>
                
                {/* تاریخ */}
                <td className="py-3 px-4 text-sm text-text-muted">{formatDate(task.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}