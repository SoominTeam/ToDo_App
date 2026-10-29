import Providers from '@/components/Providers';
import AddTaskForm from '@/components/AddTaskForm';
import TaskList from '@/components/TaskList';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import NeonStarRain from '@/components/NeonStarRain';
import Logo from '@/components/Logo';

export default function HomePage() {
  return (
    <Providers>
      <div className="min-h-screen bg-background relative">
        {/* انیمیشن بارش ستاره‌های نئون */}
        <NeonStarRain />
        {/* محتوای اصلی با z-index بالاتر */}
        <div className="relative z-10">
          {/* Header */}
          <header className="bg-surface/80 backdrop-blur-sm border-b border-border h-20 px-8 w-full sticky top-0">
            <div className="h-full flex justify-between items-center">
              <Logo />
              <div className="flex gap-3 items-center">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto p-8">
            <AddTaskForm />
            <TaskList />
          </main>
        </div>
      </div>
    </Providers>
  );
}