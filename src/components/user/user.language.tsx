'use client';

import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, LANGUAGES } from '@/lib/constants';

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useLocalStorage(STORAGE_KEYS.I18N_LANG, 'en');

  const handleChangeLang = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLang(langCode);
  };

  const { theme } = useTheme();

  return (
    <div className="flex">
      {LANGUAGES.map((langItem) => (
        <button
          key={langItem.code}
          style={{
            background: i18n.language === langItem.code ? theme["bg-btn"] : "#ffff",
            color: i18n.language === langItem.code ? theme["text-btn"] : "#000000"
          }}
          className={`cursor-pointer items-center px-1 w-[30px] text-center`}
          onClick={() => handleChangeLang(langItem.code)}
        > {langItem.label}
        </button>
      ))}
    </div>
  );
};