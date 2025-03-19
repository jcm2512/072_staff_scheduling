import { useEffect, useState } from "react";
import { DatesProvider } from "@mantine/dates";
import { db } from "@/firebaseConfig"; // Import your Firebase config
import { doc, getDoc } from "firebase/firestore";

import { CalendarComponent } from "@/features/components/CalendarComponent";

type CalendarViewProps = {
  defaultDate?: Date;
};

export function CalendarView({ defaultDate }: CalendarViewProps) {
  // Compute a fallback date if defaultDate is undefined
  const computedDefaultDate = defaultDate || new Date();
  const [schedule, setSchedule] = useState<
    Record<string, { am?: string; pm?: string }>
  >({});

  // Use computedDefaultDate to determine the year
  const year = computedDefaultDate.getFullYear();

  useEffect(() => {
    async function fetchSchedule() {
      const teacherId = "teacherId016";
      const companyId = "companyId02";

      console.log("Fetching schedule from Firestore for the whole year...");

      // Generate an array of date strings for the entire year
      const allDates: string[] = [];
      for (let month = 1; month <= 12; month++) {
        // Get the number of days in the current month
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dateString = `${year}-${String(month).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          allDates.push(dateString);
        }
      }

      const newSchedule: Record<string, { am?: string; pm?: string }> = {};

      // Fetch schedule for each date concurrently
      await Promise.all(
        allDates.map(async (date) => {
          const docRef = doc(
            db,
            "companies",
            companyId,
            "teacher",
            teacherId,
            "schedule",
            date
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            newSchedule[date] = docSnap.data();
          }
        })
      );

      console.log("Final schedule object for the whole year:", newSchedule);
      setSchedule(newSchedule);
    }

    fetchSchedule();
  }, [year]);

  return (
    <DatesProvider settings={{ consistentWeeks: true }}>
      <CalendarComponent schedule={schedule} date={new Date(year, 1)} />
    </DatesProvider>
  );
}
