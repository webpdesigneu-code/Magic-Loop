'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import plTranslations from '@/locales/pl.json';
import seTranslations from '@/locales/se.json';

type Language = 'pl' | 'se';
type Currency = 'PLN' | 'SEK';

interface TranslationContextType {
    language: Language;
    currency: Currency;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
    tArray: <T>(path: string) => T[];
}

const translations = {
    pl: plTranslations,
    se: seTranslations,
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((acc: unknown, part: string) => {
        if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, obj);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('pl');
    const [currency, setCurrency] = useState<Currency>('PLN');

    useEffect(() => {
        try {
            // Check localStorage for saved preference
            const saved = localStorage.getItem('handmade-lang') as Language | null;
            if (saved && (saved === 'pl' || saved === 'se')) {
                setLanguageState(saved);
                setCurrency(saved === 'pl' ? 'PLN' : 'SEK');
            } else {
                // Auto-detect from browser
                if (typeof navigator !== 'undefined' && navigator.language) {
                    const browserLang = navigator.language.toLowerCase();
                    if (browserLang.startsWith('sv') || browserLang.startsWith('se')) {
                        setLanguageState('se');
                        setCurrency('SEK');
                    }
                }
            }
        } catch (e) {
            console.warn('LocalStorage access failed:', e);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setCurrency(lang === 'pl' ? 'PLN' : 'SEK');
        try {
            localStorage.setItem('handmade-lang', lang);
        } catch (e) {
            console.warn('LocalStorage write failed:', e);
        }
    };

    const t = (path: string): string => {
        const value = getNestedValue(translations[language], path);
        if (typeof value === 'string') {
            return value;
        }
        console.warn(`Translation not found for path: ${path}`);
        return path;
    };

    const tArray = <T,>(path: string): T[] => {
        const value = getNestedValue(translations[language], path);
        if (Array.isArray(value)) {
            return value as T[];
        }
        return [];
    };

    return (
        <TranslationContext.Provider value={{ language, currency, setLanguage, t, tArray }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
