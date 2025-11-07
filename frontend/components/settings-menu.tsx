"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Settings, Sun, Moon, Monitor, Globe } from "lucide-react"
import { useTheme } from "@/contexts/theme-provider"
import { useLocale } from "@/contexts/locale-provider"
import { useState } from "react"
import type { Locale } from "@/lib/i18n"

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useLocale()

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  }

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen(!isOpen)
          if (navigator.vibrate) {
            navigator.vibrate(30)
          }
        }}
        className="fixed right-4 top-4 z-50 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm active:scale-95 transition-transform"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <Card
            className="absolute right-4 top-16 w-72 shadow-lg animate-in slide-in-from-top-2"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t.theme}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange("light")}
                    className="flex flex-col gap-1 h-auto py-3 active:scale-95 transition-transform"
                  >
                    <Sun className="h-4 w-4" />
                    <span className="text-xs">{t.light}</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange("dark")}
                    className="flex flex-col gap-1 h-auto py-3 active:scale-95 transition-transform"
                  >
                    <Moon className="h-4 w-4" />
                    <span className="text-xs">{t.dark}</span>
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange("system")}
                    className="flex flex-col gap-1 h-auto py-3 active:scale-95 transition-transform"
                  >
                    <Monitor className="h-4 w-4" />
                    <span className="text-xs">{t.system}</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">{t.language}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={locale === "ru" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLocaleChange("ru")}
                    className="flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-xs">{t.russian}</span>
                  </Button>
                  <Button
                    variant={locale === "kk" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLocaleChange("kk")}
                    className="flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-xs">{t.kazakh}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
