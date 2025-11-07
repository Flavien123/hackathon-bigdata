"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/contexts/language-context"
import { useTheme } from "@/lib/contexts/theme-context"
import { Settings, Moon, Sun, Languages } from "lucide-react"

export function SettingsMenu() {
  const { language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Настройки</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          {language === "ru" ? "Тема" : "Тақырып"}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>{language === "ru" ? "Светлая" : "Ашық"}</span>
          {theme === "light" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>{language === "ru" ? "Темная" : "Қараңғы"}</span>
          {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          {language === "ru" ? "Язык" : "Тіл"}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setLanguage("ru")} className="cursor-pointer">
          <span>Русский</span>
          {language === "ru" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("kk")} className="cursor-pointer">
          <span>Қазақша</span>
          {language === "kk" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
