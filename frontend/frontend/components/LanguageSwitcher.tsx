'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'fa' ? 'en' : 'fa';
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <button
      onClick={switchLocale}
      className="px-4 py-2 rounded-lg bg-surface border border-border hover:bg-primary-soft transition-colors text-text font-bold font-[family-name:var(--font-minako)]"
      dir="ltr"
    >
      {locale === 'fa' ? 'EN' : 'FA'}
    </button>
  );
}