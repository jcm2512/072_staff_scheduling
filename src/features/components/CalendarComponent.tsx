import { Stack, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig"; // Your Firebase config
import { doc, onSnapshot } from "firebase/firestore";

type CalendarComponentProps = {
  date?: Date;
  swipe?: Boolean;
};

type DaySchedule = {
  am?: string;
  pm?: string;
  allday?: boolean;
  irregular?: boolean;
};

export function CalendarComponent({
  date = new Date(),
  swipe = false,
}: CalendarComponentProps) {
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});

  useEffect(() => {
    const teacherId = "teacherId016";
    const companyId = "companyId02";

    console.log("Fetching schedule from Firestore...");

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}-${month}`;

    console.log(yearMonth);

    const scheduleDocRef = doc(
      db,
      "companies",
      companyId,
      "teacher",
      teacherId,
      "monthlySchedule",
      yearMonth
    );

    console.log("Fetching schedule from Firestore...");

    const unsubscribe = onSnapshot(scheduleDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        const days = data ?? {};
        setSchedule(days);
        console.log(days);
      } else {
        console.log("No document found for this month");
        setSchedule({});
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <Calendar
        defaultDate={date}
        firstDayOfWeek={0}
        withCellSpacing={false}
        maxLevel="month"
        style={{
          borderSpacing: "0",
          height: "fit-content",
        }}
        styles={{
          calendarHeaderControl: {
            display: swipe ? "none" : "block",
          },
          calendarHeader: {
            minWidth: "100%",
            padding: "var(--mantine-font-size-xs)",
          },
          calendarHeaderLevel: {
            fontSize: "var(--mantine-font-size-xl)",
          },
          month: {
            width: "90vw", // cant use % as it will include the whole carousel.
          },
          monthTbody: {
            borderStyle: "hidden", // removes outside border on table
          },
          levelsGroup: {
            justifyContent: "center",
            width: "100%",
            border: "2px solid #eaeaea",
            borderRadius: `var(--mantine-radius-lg)`,
            overflow: "hidden",
            boxSizing: "border-box",
            backgroundColor: "white",
          },

          monthCell: {
            // backgroundColor: "#f3f6f7",
            borderWidth: "1px",
            border: "solid 1px #eaeaea",
            lineHeight: "0",
          },
          day: {
            height: "100%",
            width: "100%",
          },
        }}
        renderDay={(date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          // Pad the day to two digits
          const day = String(date.getDate()).padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;
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
      ></Calendar>
    </>
  );
}
