import type { Lang } from './i18n';

export const localeFor = (lang: Lang) => (lang === 'en' ? 'en-GB' : 'fr-FR');

const priceFormatters = new Map<Lang, Intl.NumberFormat>();

/** Formats a euro amount; the output never breaks between the amount and the currency symbol. */
export function formatPrice(amount: number, lang: Lang): string {
  let formatter = priceFormatters.get(lang);
  if (!formatter) {
    formatter = new Intl.NumberFormat(localeFor(lang), { style: 'currency', currency: 'EUR' });
    priceFormatters.set(lang, formatter);
  }
  return formatter.format(amount).replace(/ /g, '\u00a0');
}

export function formatDate(value: string | Date, lang: Lang, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(localeFor(lang), options);
}
