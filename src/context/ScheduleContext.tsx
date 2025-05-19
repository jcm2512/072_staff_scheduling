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
  const [_fetchedSchedule, setFetchedSchedule] = useState(false);
  const { employeeId } = useEmployeeId();

  useEffect(() => {
    if (!employeeId) return;

    const storageKey = `${employeeId}-schedule`;
    const localCacheKey = localStorage.getItem(storageKey);
    const localCacheDB = localCacheKey ? JSON.parse(localCacheKey) : {};

    let localSchedule = {};
    for (const key in localCacheDB) {
      if (localCacheDB[key]?.days) {
        localSchedule = {
          ...localSchedule,
          ...localCacheDB[key].days,
        };
      }
    }

    // Load local cache
    setSchedule(localSchedule);
    setFetchedSchedule(true);

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
      let updated = false;

      snapshot.forEach((docSnapshot) => {
        if (docSnapshot.exists()) {
          const docId = docSnapshot.id;
          // SD stands for [S]chedule [D]ata
          const remoteDB = docSnapshot.data();

          if (!remoteDB || !remoteDB.days) return;

          const lastUpdatedRemote = remoteDB.lastUpdated
            ? remoteDB.lastUpdated.toDate()
            : new Date(0); // fallback if entry doesn't have a key for last update

          const lastUpdatedLocal = localCacheDB[docId]?.lastUpdated
            ? new Date(localCacheDB[docId].lastUpdated)
            : new Date(0);

          if (lastUpdatedRemote > lastUpdatedLocal) {
            // Remote DB is newer
            localCacheDB[docId] = {
              days: remoteDB.days,
              lastUpdated: lastUpdatedRemote.toISOString(),
            };

            mergedDays = {
              ...mergedDays,
              ...remoteDB.days,
            };

            updated = true;
            console.log(`Local Cache Updated for ${docId}`);
          }
        }
      });

      if (updated) {
        localStorage.setItem(storageKey, JSON.stringify(localCacheDB));
        setSchedule(mergedDays);
        setFetchedSchedule(true);
      }
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
