import { useEffect, useState } from "react";
import { Stack } from "@mantine/core";
import { ScheduleView, createTheme } from "react-schedule-view";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

import { useSelectedDayContext } from "@/context/SelectedDayContext";
import { useHeaderContext } from "@/context/HeaderContext";
import { useMenuContext } from "@/context/MenuContext";
import { HeaderType } from "@/context/HeaderContext";

type DayViewType = {
  headerType?: HeaderType;
};

const theme = createTheme("google", {
  style: {
    dayLabels: {
      display: "none",
    },
  },
});

export function DayView({ headerType = "basic" }: DayViewType) {
  const { selectedDay } = useSelectedDayContext();
  const { setHeaderType } = useHeaderContext();
  const { menuHeight } = useMenuContext();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setHeaderType(headerType);
  }, []);

  useEffect(() => {
    if (!selectedDay) return;

    const fetchDaySchedule = async () => {
      const yearMonth = selectedDay.toISOString().slice(0, 7); // e.g., "2025-04"
      const dateStr = selectedDay.toISOString().slice(0, 10); // e.g., "2025-04-25"

      const ref = doc(
        db,
        "companies",
        "companyId02",
        "teacher",
        "teacherId016",
        "monthlySchedule",
        yearMonth
      );
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const docData = snapshot.data();
        const dayData = docData.days?.[dateStr];

        if (dayData) {
          const events = [];

          if (typeof dayData.am === "string" && dayData.am.trim()) {
            events.push({
              startTime: 10,
              endTime: 12,
              title: dayData.am,
              color: "#4ECDC4",
            });
          }

          if (typeof dayData.pm === "string" && dayData.pm.trim()) {
            events.push({
              startTime: 14,
              endTime: 18,
              title: dayData.pm,
              color: "#C4F5FC",
            });
          }

          setData([
            {
              name: selectedDay.toDateString(),
              events: events.length > 0 ? events : [],
            },
          ]);
        } else {
          setData([
            {
              name: selectedDay.toDateString(),
              events: [],
            },
          ]);
        }
      }
    };

    fetchDaySchedule();
  }, [selectedDay]);

  return (
    <Stack
      h={"100vh"}
      w={"100%"}
      style={{
        paddingTop: menuHeight,
        height: `calc(100vh - ${menuHeight}px)`,
        overflow: "auto",
      }}
    >
      <ScheduleView
        theme={theme}
        daySchedules={data.length > 0 ? data : [{ name: "", events: [] }]}
        viewStartTime={7}
        viewEndTime={24}
      />
    </Stack>
  );
}
