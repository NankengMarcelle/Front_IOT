"use client";

import { useLanguageStore } from '@/store/useUserStore';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
    const { lang, setLang } = useLanguageStore();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
        { code: 'en' as const, label: 'English', flag: '🇬🇧' }
    ];

    const currentLang = languages.find(l => l.code === lang) || languages[0];

    const handleLanguageChange = (code: 'en' | 'fr') => {
        setLang(code);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white border border-emerald-100 rounded-xl transition-all"
                title="Change Language"
            >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black uppercase tracking-widest text-[#052E16]">
                    {currentLang.code.toUpperCase()}
                </span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white rounded-2xl shadow-2xl border border-emerald-50 p-2 z-50 animate-fadeIn">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${lang === language.code
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'hover:bg-slate-50 text-[#052E16]'
                                    }`}
                            >
                                <span className="text-xl">{language.flag}</span>
                                <span className="text-xs font-black uppercase tracking-widest flex-1 text-left">
                                    {language.label}
                                </span>
                                {lang === language.code && (
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
