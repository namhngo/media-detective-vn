"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import {
  languageCookie,
  messages,
  normalizeLanguage,
  type Language,
  type MessageKey,
} from "@/lib/i18n";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLanguage = "en",
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const language = useSyncExternalStore<Language>(
    (onChange) => {
      window.addEventListener("mdv-language-change", onChange);
      return () => window.removeEventListener("mdv-language-change", onChange);
    },
    () =>
      normalizeLanguage(
        document.cookie.match(new RegExp(`${languageCookie}=([^;]+)`))?.[1],
      ),
    () => initialLanguage,
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage(next: Language) {
        const enabledLanguage = normalizeLanguage(next);
        document.cookie = `${languageCookie}=${enabledLanguage}; path=/; max-age=31536000; samesite=lax`;
        localStorage.setItem(languageCookie, enabledLanguage);
        window.dispatchEvent(new Event("mdv-language-change"));
        window.location.reload();
      },
      t(key: MessageKey) {
        return messages[language][key];
      },
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
