import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { SiteSettings } from '../types'
import { DEFAULT_SETTINGS } from '../lib/constants'
import { fetchSiteSettings } from '../lib/api'

interface SiteSettingsState {
  settings: SiteSettings
  loading: boolean
  refreshSettings: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsState>({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
})

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const refreshSettings = async () => {
    try {
      const data = await fetchSiteSettings()
      setSettings(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshSettings()
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
