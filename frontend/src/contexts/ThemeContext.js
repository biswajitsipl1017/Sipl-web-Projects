// import React, { createContext, useState, useEffect } from 'react';

// export const ThemeContext = createContext();

// const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

//   useEffect(() => {
//     const root = document.documentElement;
//     const isDarkMode =
//       theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

//     root.classList.remove('light', 'dark');
//     root.classList.add(isDarkMode ? 'dark' : 'light');
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export default ThemeProvider;
