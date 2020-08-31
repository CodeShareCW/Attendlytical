import React, { useState, createContext } from "react";

const NavbarContext = createContext({
  collapsed: false,
});
const NavbarProvider = (props) => {
  const [collapsed, SetCollapsed] = useState(false);
  function toggleCollapsed() {
    SetCollapsed((collapsed) => !collapsed);
  }
  return (
    <NavbarContext.Provider value={{ collapsed, toggleCollapsed }} {...props} />
  );
};
export { NavbarContext, NavbarProvider };
