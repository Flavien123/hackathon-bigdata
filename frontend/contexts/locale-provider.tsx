"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof useTranslation>
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ru")
  const [mounted, setMounted] = useState(false)
  const t = useTranslation(locale)

  useEffect(() => {
    setMounted(true)
    const savedLocale = localStorage.getItem("locale") as Locale | null
    if (savedLocale && (savedLocale === "ru" || savedLocale === "kk")) {
      setLocale(savedLocale)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("locale", locale)
    document.documentElement.lang = locale
  }, [locale, mounted])

  const value = {
    locale,
    setLocale,
    t,
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
