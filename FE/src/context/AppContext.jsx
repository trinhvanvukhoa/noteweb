import { useState, useEffect } from 'react';
import { AppContext } from './useAppContext';

export function AppProvider({ children }) {
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('http://localhost:3000/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setDisplayName(data.displayName || '');
        setTheme(data.theme || 'light');
      })
      .catch(() => {});
  }, []);

  return (
    <AppContext.Provider value={{ displayName, setDisplayName, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}