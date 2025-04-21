import { createContext, useContext, useState } from "react";

type SelectedDayContextType = {
  selectedDay: Date | undefined;
  setSelectedDay: (val: Date | undefined) => void;
};

const SelectedDayContext = createContext<SelectedDayContextType | undefined>(
  undefined
);

export const SelectedDayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Hooks
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();

  return (
    <SelectedDayContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
      }}
    >
      {children}
    </SelectedDayContext.Provider>
  );
};

export const useSelectedDayContext = () => {
  const context = useContext(SelectedDayContext);
  if (!context) {
    throw new Error(
      "useSelectedDayContext must be used within a SelectedDayProvider"
    );
  }
  return context;
};
