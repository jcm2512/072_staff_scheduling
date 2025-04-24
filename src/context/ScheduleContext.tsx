import { createContext, useContext, useEffect, useState } from "react";
import { useEmployeeId } from "@/hooks/useEmployeeId";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";

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
  const [fetchedSchedule, setFetchedSchedule] = useState(false);
  const { employeeId } = useEmployeeId();

  useEffect(() => {
    if (!employeeId) return;

    const scheduleCollectionRef = collection(
      db,
      "companies",
      "companyId02",
      "teacher",
      employeeId,
      "monthlySchedule"
    );

    const unsubscribe = onSnapshot(scheduleCollectionRef, (snapshot) => {
      let mergedDays: Record<string, DaySchedule> = {};

      snapshot.forEach((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const days = data?.days ?? {};

          mergedDays = {
            ...mergedDays,
            ...days,
          };
        }
      });

      setSchedule(mergedDays);
      setFetchedSchedule(true);
    });

    return () => unsubscribe();
  }, [employeeId]);

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
