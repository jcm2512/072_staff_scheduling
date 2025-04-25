import { useHeaderContext } from "@/context/HeaderContext";
import { Stack, Text } from "@mantine/core";
import { useEffect } from "react";

import { HeaderType } from "@/context/HeaderContext";
import { useMenuContext } from "@/context/MenuContext";

import { ScheduleView } from "react-schedule-view";

import { useSelectedDayContext } from "@/context/SelectedDayContext";

type DayViewType = {
  headerType?: HeaderType;
};
export function DayView({ headerType = "basic" }: DayViewType) {
  const { selectedDay } = useSelectedDayContext();

  const { setHeaderType } = useHeaderContext();
  const { menuHeight } = useMenuContext();

  const data = [
    {
      name: selectedDay?.toDateString() ?? "No Date Selected",
      events: [
        {
          startTime: 10,
          endTime: 12.33,
          title: "MO",
          // description: "K2　｜　K3",
          color: "#4ECDC4",
        },
        {
          startTime: 14.16,
          endTime: 18,
          title: "MO",
          color: "#C4F5FC",
          // description: "K2　｜　K3　｜　E1　｜　E2",
        },
      ],
    },
  ];

  useEffect(() => {
    setHeaderType(headerType);
  }, []);

  //   useEffect(() => {
  //     console.log(selectedDay);
  //   }, [selectedDay]);

  return (
    <Stack
      h={"100vh"}
      w={"100%"}
      style={{
        paddingTop: "200px",
        height: `calc(100vh - ${menuHeight}px)`,
        overflow: "auto",
      }}
    >
      <ScheduleView
        theme="google"
        daySchedules={data}
        viewStartTime={7}
        viewEndTime={24}
      />
    </Stack>
  );
}
