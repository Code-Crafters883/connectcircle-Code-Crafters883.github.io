import { en } from './en';
import { ur } from './ur';
import { Language } from '../types';

export const translations = {
  en,
  ur,
};

export type TranslationsType = typeof en;

export function getTranslations(lang: Language): TranslationsType {
  return (translations[lang] || translations.en) as TranslationsType;
}
