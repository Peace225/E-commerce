// src/context/CategorieContext.jsx
import React, { createContext, useState } from 'react';

export const CategorieContext = createContext();

export const CategorieProvider = ({ children }) => {
  const [categorieActive, setCategorieActive] = useState('Toutes');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <CategorieContext.Provider value={{ categorieActive, setCategorieActive, menuOpen, setMenuOpen }}>
      {children}
    </CategorieContext.Provider>
  );
};