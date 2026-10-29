import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // زبان درخواست‌شده توسط کاربر (از URL / کوکی)
  const requested = await requestLocale;

  // اگر زبان معتبر بود همان، در غیر این صورت پیش‌فرض
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});