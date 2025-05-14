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
  hourHeight: "6rem",
  style: {
    dayLabels: {
      display: "none",
    },
    eventTiles: {
      fontSize: "0.8rem",
    },
  },
});

// 🔧 Helper: Fetch class data for either Seika or Kagai
const resolveClassData = async (
  schoolId: string,
  shiftType: "S" | "K",
  color: string,
  events: any[]
) => {
  const ref = doc(db, "companies", "companyId02", "schools", schoolId);

  try {
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // School doc missing → fallback to default block
      events.push({
        startTime: shiftType === "S" ? 10 : 14,
        endTime: shiftType === "S" ? 12 : 17,
        title: schoolId,
        color,
      });
      return;
    }

    const shiftData = snap.data()?.[shiftType];
    if (!shiftData || !Array.isArray(shiftData.classes)) {
      // Shift data missing or malformed → fallback block
      events.push({
        startTime: shiftType === "S" ? 10 : 14,
        endTime: shiftType === "S" ? 12 : 17,
        title: schoolId,
        color,
      });
      return;
    }

    // ✅ Valid data — use it
    shiftData.classes.forEach((cls: any) => {
      events.push({
        startTime: cls.start,
        endTime: cls.end,
        title: `${schoolId} ${cls.class ?? ""}`,
        color,
      });
    });
  } catch (err) {
    console.error(
      `Error loading school data for ${schoolId} (${shiftType})`,
      err
    );
    // Last-resort fallback for network/security errors
    events.push({
      startTime: shiftType === "S" ? 10 : 14,
      endTime: shiftType === "S" ? 12 : 17,
      title: `${schoolId} (load error)`,
      color,
    });
  }
};

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

      if (!snapshot.exists()) return;

      const docData = snapshot.data();
      const dayData = docData.days?.[dateStr];

      if (!dayData) {
        setData([{ name: selectedDay.toDateString(), events: [] }]);
        return;
      }

      const events: any[] = [];

      if (typeof dayData.am === "string" && dayData.am.trim()) {
        await resolveClassData(dayData.am, "S", "#4ECDC4", events); // AM = Seika
      }

      if (typeof dayData.pm === "string" && dayData.pm.trim()) {
        await resolveClassData(dayData.pm, "K", "#C4F5FC", events); // PM = Kagai
      }

      setData([
        {
          name: selectedDay.toDateString(),
          events: events.length > 0 ? events : [],
        },
      ]);
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
        viewStartTime={8}
        viewEndTime={24}
      />
    </Stack>
  );
}
