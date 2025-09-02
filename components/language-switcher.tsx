"use client"

import { useTranslation } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"

const languageNames = {
  en: "English",
  gu: "ગુજરાતી",
  hi: "हिन्दी"
}

const languageFlags = {
  en: "🇺🇸",
  gu: "🇮🇳",
  hi: "🇮🇳"
}

export function LanguageSwitcher() {
  const { language, changeLanguage, supportedLanguages } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languageFlags[language]} {languageNames[language]}
          </span>
          <span className="sm:hidden">
            {languageFlags[language]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {languageFlags[lang]} {languageNames[lang]}
            </span>
            {language === lang && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
