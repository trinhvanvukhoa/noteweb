import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [displayName, setDisplayName] = useState('')
  const [theme, setTheme] = useState('light')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((profile) => {
        setDisplayName(profile.displayName ?? '')
        setTheme(profile.preferences?.theme ?? 'light')
      })
      .finally(() => setLoading(false))
  }, [])

  const value = {
    displayName,
    setDisplayName,
    theme,
    setTheme,
    loading,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp phải được dùng bên trong AppProvider')
  }
  return context
}