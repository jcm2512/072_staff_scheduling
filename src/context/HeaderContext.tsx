import { createContext, useContext, useState } from "react";

type HeaderType = "calendar" | "none"; // Add your types

type HeaderContextType = {
  headerHeight: number;
  setHeaderHeight: (val: number) => void;
  headerType: HeaderType;
  setHeaderType: (val: HeaderType) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  // Hooks
  const [headerHeight, setHeaderHeight] = useState<number>(60);
  const [headerType, setHeaderType] = useState<HeaderType>("none");

  return (
    <HeaderContext.Provider
      value={{
        headerHeight,
        setHeaderHeight,
        headerType,
        setHeaderType,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};
