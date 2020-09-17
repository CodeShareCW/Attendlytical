import React, { createContext, useState } from 'react';
import { INITIAL_COLLAPSE } from '../globalData';

const NavbarContext = createContext();

const NavbarProvider = (props) => {
  const [collapsed, SetCollapsed] = useState(INITIAL_COLLAPSE);
  function toggleCollapsed() {
    SetCollapsed((collapsed) => !collapsed);
  }
  return (
    <NavbarContext.Provider value={{ collapsed, toggleCollapsed }} {...props} />
  );
};
export { NavbarContext, NavbarProvider };
