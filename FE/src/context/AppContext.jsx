import { useState } from 'react';
import { AppContext } from './useAppContext';

export function AppProvider({ children }) {
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ displayName, setDisplayName, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}
