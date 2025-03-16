import { useEffect, useState } from "react";
import { Paper, Stack, Text } from "@mantine/core";
import { Calendar, DatesProvider } from "@mantine/dates";
import { db } from "@/firebaseConfig"; // Import your Firebase config
import { doc, getDoc } from "firebase/firestore";

export function CalendarView() {
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
    <Paper shadow="xs" p="md">
      <DatesProvider settings={{ consistentWeeks: true }}>
        <Calendar
          firstDayOfWeek={0}
          size="xl"
          withCellSpacing={false}
          maxLevel="month"
          styles={{
            calendarHeader: { minWidth: "100%" },
            month: { width: "100%" },
            levelsGroup: { justifyContent: "center", width: "100%" },
            day: {
              border: "solid",
              borderWidth: "1px",
              borderColor: "#ddd",
              height: "auto",
              width: "100%",
              borderRadius: "5px",
              borderRight: "none",
              borderTop: "none",
            },
          }}
          renderDay={(date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month

            const day = date.getDate();
            const formattedDate = `${year}-${month}-${day}`; // Dynamic YYYY-MM-DD
            const daySchedule = schedule[formattedDate] || {};

            return (
              <Stack align="center" justify="center">
                <div>{day}</div>
                <Stack align="center" justify="center">
                  <Text c={"blue"} inline={true}>
                    {daySchedule.am || "-"}
                  </Text>
                  <Text c={"green"} inline={true}>
                    {daySchedule.pm || "-"}
                  </Text>
                </Stack>
              </Stack>
            );
          }}
        />
      </DatesProvider>
    </Paper>
  );
}
