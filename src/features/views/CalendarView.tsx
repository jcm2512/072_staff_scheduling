import { useEffect, useState } from "react";
import { Paper, Stack, Text, Container } from "@mantine/core";
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
    <Paper
      shadow="xs"
      p="sm"
      style={{ borderRadius: `var(--mantine-radius-lg)` }}
    >
      <DatesProvider settings={{ consistentWeeks: true }}>
        <Calendar
          firstDayOfWeek={0}
          withCellSpacing={false}
          maxLevel="month"
          styles={{
            calendarHeader: {
              minWidth: "100%",
              margin: "0px",
            },
            month: {
              width: "100%",
            },

            levelsGroup: { justifyContent: "center", width: "100%" },
            monthCell: {
              // backgroundColor: "#f3f6f7",
              borderWidth: "1px",
              border: "solid 1px #eaeaea",
            },
            day: {
              height: "100%",
              width: "100%",
            },
          }}
          renderDay={(date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month

            const day = date.getDate();
            const formattedDate = `${year}-${month}-${day}`; // Dynamic YYYY-MM-DD
            const daySchedule = schedule[formattedDate] || {};

            return (
              <Stack align="center" h={"4.5rem"} gap={"0"}>
                <Text size="xs">{day}</Text>

                <Text
                  c={daySchedule.am == "Office" ? "gray" : "cyan"}
                  inline={true}
                  size="xs"
                  m={"xs"}
                >
                  {daySchedule.am || ""}
                </Text>
                <Text
                  c={daySchedule.pm == "Office" ? "gray" : "green"}
                  inline={true}
                  size="xs"
                >
                  {daySchedule.pm || ""}
                </Text>
              </Stack>
            );
          }}
        />
      </DatesProvider>
    </Paper>
  );
}
