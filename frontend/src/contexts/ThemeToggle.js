// import React, { useContext } from 'react';
// import { ThemeContext } from './ThemeContext';

// const ThemeToggle = () => {
//   const { theme, setTheme } = useContext(ThemeContext);

//   const toggleTheme = () => {
//     if (theme === 'light') setTheme('dark');
//     else if (theme === 'dark') setTheme('system');
//     else setTheme('light');
//   };

//   const themeIcon = {
//     light: '🌞',
//     dark: '🌙',
//     system: '🖥️',
//   };

//   return (
//     <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : theme === 'dark' ? 'System' : 'Light'} Theme`}>
//       {themeIcon[theme]}
//     </button>
//   );
// };

// export default ThemeToggle;
