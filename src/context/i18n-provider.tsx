'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

interface ProviderProps {
    children: ReactNode
}

export default function I18nProvider({ children }: ProviderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem('i18nextLng') || 'en';
    i18n.changeLanguage(lang).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}