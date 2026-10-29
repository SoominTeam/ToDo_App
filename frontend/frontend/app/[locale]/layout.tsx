import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import '../globals.css';

const minako = localFont({
  src: '../../fonts/Minako.ttf',
  variable: '--font-minako',
  display: 'swap',
});

const vazirmatn = localFont({
  src: [
    { path: '../../fonts/Vazirmatn-Regular.woff2', weight: '400' },
    { path: '../../fonts/Vazirmatn-Bold.woff2', weight: '700' },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Done & Dusted - Get it done and dusted!',
  description: 'Done & Dusted - Sprint 1 - Software Engineering Project',
  icons: {
    icon: '/favicon.ico',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <body
        className={`${minako.variable} ${vazirmatn.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}