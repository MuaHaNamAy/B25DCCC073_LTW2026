// ============================================================
// [BÀI 2 - mục 1] Đổi giao diện sáng/tối bằng Context
// ============================================================
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  // [BÀI 3 - mục 1] Ghi nhớ chủ đề qua localStorage
  const [theme, setTheme] = useLocalStorage('ltw_bongda_theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme phải dùng bên trong ThemeProvider');
  }
  return context;
};
