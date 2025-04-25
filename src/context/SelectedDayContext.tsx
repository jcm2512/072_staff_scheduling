import { createContext, useContext, useEffect, useState } from "react";

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
  const [selectedDay, _setSelectedDay] = useState<Date | undefined>();

  const setSelectedDay = (val: Date | undefined) => {
    console.log("🔍 setSelectedDay called with:", val?.toISOString());
    console.trace("setSelectedDay was triggered by:");
    _setSelectedDay(val);
  };

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
