import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { createContext, useContext, useState } from "react";

export type HeaderType = "calendar" | "basic" | "none"; // Add your types

type HeaderContextType = {
  headerHeight: number;
  setHeaderHeight: (val: number) => void;
  headerType: HeaderType;
  setHeaderType: (val: HeaderType) => void;
  isMobile: boolean;
  contextualHeaderTitle: string;
  setContextualHeaderTitle: (val: string) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  // Hooks
  const [headerHeight, setHeaderHeight] = useState<number>(60);
  const [headerType, setHeaderType] = useState<HeaderType>("none");
  const [contextualHeaderTitle, setContextualHeaderTitle] =
    useState<string>("");
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`) ?? false;

  return (
    <HeaderContext.Provider
      value={{
        headerHeight,
        setHeaderHeight,
        headerType,
        setHeaderType,
        isMobile,
        contextualHeaderTitle,
        setContextualHeaderTitle,
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
