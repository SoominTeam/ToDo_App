'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/lib/api';
import { TASK_LIMITS } from '@/lib/types';

export default function AddTaskForm() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => createTask(title.trim(), description.trim()),
    onSuccess: () => {
      // به‌روزرسانی خودکار لیست وظایف پس از ثبت موفق
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // پاک کردن فرم و خطاها
      setTitle('');
      setDescription('');
      setError('');
    },
    onError: (err: any) => {
      // دریافت کد خطا از بک‌اند (مثلاً "TITLE_REQUIRED")
      const code = err?.response?.data?.error || err?.message || 'SERVER_ERROR';
      
      // تبدیل کد خطا به پیام ترجمه‌شده از فایل messages
      // اگر کد ناشناخته بود، پیام UNKNOWN نمایش داده می‌شود
      const translatedMessage = t.raw(`errors.${code}`);
      const errorMessage = typeof translatedMessage === 'string' 
        ? translatedMessage 
        : t('errors.UNKNOWN');
        
      setError(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    // اعتبارسنجی سمت کلاینت (Client-side Validation)
    if (!trimmedTitle) {
      setError(t('errors.TITLE_REQUIRED'));
      return;
    }

    if (trimmedTitle.length > TASK_LIMITS.TITLE_MAX) {
      setError(t('errors.TITLE_TOO_LONG'));
      return;
    }

    if (trimmedDesc.length > TASK_LIMITS.DESCRIPTION_MAX) {
      setError(t('errors.INVALID_INPUT'));
      return;
    }

    // ارسال به سرور (فعلاً Mock API)
    mutation.mutate();
  };

  return (
    <section className="bg-surface border border-border rounded-lg p-6 mb-8 shadow-sm">
      <h2 className="text-xl font-bold text-text mb-4">{t('task.form.heading')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* فیلد عنوان */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text mb-2">
            {t('task.form.title')} <span className="text-error">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('task.form.titlePlaceholder')}
            dir="auto"
            maxLength={200}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            disabled={mutation.isPending}
          />
        </div>

        {/* فیلد توضیحات */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text mb-2">
            {t('task.form.description')}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('task.form.descriptionPlaceholder')}
            dir="auto"
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            disabled={mutation.isPending}
          />
        </div>

        {/* نمایش پیام خطا */}
        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg text-sm flex items-center gap-2" dir="auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* دکمه ثبت */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary text-on-primary py-2.5 px-4 rounded-lg font-medium hover:bg-primary-hover active:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('task.form.submitting')}
            </>
          ) : (
            t('task.form.submit')
          )}
        </button>
      </form>
    </section>
  );
}