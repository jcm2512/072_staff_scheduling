import { useEffect, useState } from "react";

import { DatesProvider } from "@mantine/dates";
import { db } from "@/firebaseConfig"; // Import your Firebase config
import { doc, getDoc } from "firebase/firestore";

import { CalendarComponent } from "@/components/Calendar";

type CalendarViewProps = {
  defaultDate?: Date; // Optional, if you want to make it optional
};

export function CalendarView({ defaultDate }: CalendarViewProps) {
  const [schedule, setSchedule] = useState<
    Record<string, { am?: string; pm?: string }>
  >({});

  useEffect(() => {
    async function fetchSchedule() {
      const teacherId = "teacherId016";
      const companyId = "companyId02";

      console.log("Fetching schedule from Firestore...");

      // Generate date strings for March 2025
      const monthDates = [...Array(31)].map(
        (_, i) => `2025-03-${String(i + 1).padStart(2, "0")}`
      );

      const newSchedule: Record<string, { am?: string; pm?: string }> = {};

      for (const date of monthDates) {
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
      }

      console.log("Final schedule object:", newSchedule);
      setSchedule(newSchedule);
    }

    fetchSchedule();
  }, []);

  return (
    <DatesProvider settings={{ consistentWeeks: true }}>
      <CalendarComponent schedule={schedule} defaultDate={defaultDate} />
    </DatesProvider>
  );
}
