import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  const validLocale = locale as Locale;

  const messages = (await import(`../../messages/${validLocale}.json`)).default;
  return {
    locale: validLocale,
    messages
  };
});

