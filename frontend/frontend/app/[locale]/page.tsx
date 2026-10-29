import { useTranslations } from 'next-intl';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      {/* Header - تمام عرض با لوگو و دکمه‌ها در گوشه‌ها */}
      <header className="bg-surface border-b border-border h-20 px-8 w-full">
        <div className="h-full flex justify-between items-center">
          {/* لوگو - در گوشه (راست در RTL، چپ در LTR) */}
          <Logo />
          
          {/* دکمه‌ها - در گوشه مخالف */}
          <div className="flex gap-3 items-center">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content - با عرض محدود و وسط‌چین */}
      <main className="max-w-7xl mx-auto p-8">
        <p className="text-text-muted text-center text-lg">{t('app.subtitle')}</p>
      </main>
    </div>
  );
}