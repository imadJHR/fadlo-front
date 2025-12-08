"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "../lib/translations"

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en")

  // Load language from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage: toggleLanguage, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
