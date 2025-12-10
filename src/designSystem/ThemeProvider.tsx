/**
 * Theme Provider
 * 
 * Provides design tokens to all components via React Context
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { tokens } from './tokens';

type ThemeContextType = typeof tokens;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={tokens}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access design tokens throughout the app
 * @throws Error if used outside of ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
