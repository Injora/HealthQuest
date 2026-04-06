import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem('aiHealthUser') || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('aiHealthTheme') || 'light');

  // Handle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('aiHealthTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Handle User
  const login = (email) => {
    setUser(email);
    localStorage.setItem('aiHealthUser', email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aiHealthUser');
  };

  return (
    <AppContext.Provider value={{ user, login, logout, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
