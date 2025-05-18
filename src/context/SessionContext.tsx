import { createContext, useContext, useState } from "react";

type SessionContextType = {
  calendarScrollIndex: number | null;
  setCalendarScrollIndex: (y: number | null) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Hooks
  const [calendarScrollIndex, setCalendarScrollIndex] = useState<number | null>(
    null
  );

  return (
    <SessionContext.Provider
      value={{
        calendarScrollIndex,
        setCalendarScrollIndex,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
};
