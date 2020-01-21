// ThemeContext.js
// Manage the theme styles 'light' or 'dark'
import React from "react";
 
export const ThemeContext = React.createContext({
    style: 'dark',
    toggleTheme: () => {}
});