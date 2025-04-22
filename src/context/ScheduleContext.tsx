import { createContext, useContext, useState } from "react";

type DaySchedule = {
  am?: string;
  pm?: string;
  allday?: boolean;
  irregular?: boolean;
};

type ScheduleContextType = {
  schedule: Record<string, DaySchedule>;
  setSchedule: React.Dispatch<
    React.SetStateAction<Record<string, DaySchedule>>
  >;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const ScheduleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Hooks
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error(
      "useScheduleContext must be used within a ScheduleProvider"
    );
  }
  return context;
};
