import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

type ScheduleData = {
  [date: string]: // "2025-03-01"
  {
    am: string; // "DT"
    pm: string; // "Office"
    allday: boolean;
    irregular: boolean;
  };
};

export function useSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function setMonthlySchedule(
    companyId: string,
    teacherId: string,
    yearMonth: string,
    scheduleData: ScheduleData
  ) {
    setLoading(true);
    setError(null);
    try {
      const scheduleRef = doc(
        db,
        "companies",
        companyId,
        "teacher",
        teacherId,
        "monthlySchedule",
        yearMonth
      );
      await setDoc(scheduleRef, scheduleData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { setMonthlySchedule, loading, error };
}
