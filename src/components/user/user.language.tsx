'use client';

import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', icon: 'fi fi-gb' , border:'border-r'},
  { code: 'vi', label: 'VI', icon: 'fi fi-vn' , border:''}
];

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const handleChangeLang = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };
  const { theme } = useTheme();

  return (
    <div className="flex">
      {languages.map((lang) => (
        <button 
          key={lang.code}
          style={{
            background: i18n.language === lang.code ? theme["bg-btn"] : "#ffff",
            color: i18n.language === lang.code ? theme["text-btn"] : "#000000"
          }}
          className={`cursor-pointer items-center px-1 w-[30px] text-center`}
          onClick={() => handleChangeLang(lang.code)}
        > {lang.label}
        </button>
      ))}
    </div>
  );
};