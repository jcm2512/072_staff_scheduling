import { createContext, useContext, useState } from "react";

type SelectedMenu = "home" | "calendar";

type MenuContextType = {
  selectedMenu: SelectedMenu;
  setSelectedMenu: (val: SelectedMenu) => void;
  menuHeight: number;
  setMenuHeight: (val: number) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  // Hooks
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>("calendar");
  const [menuHeight, setMenuHeight] = useState<number>(60);

  return (
    <MenuContext.Provider
      value={{
        selectedMenu,
        setSelectedMenu,
        menuHeight,
        setMenuHeight,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};
