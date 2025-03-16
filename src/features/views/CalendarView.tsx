import { Paper, Stack } from "@mantine/core";
import { Calendar, DatesProvider, MonthPicker } from "@mantine/dates";

export function CalendarView() {
  return (
    <Paper
      shadow="xs"
      p="md"
      w={"100%"}
      styles={{
        root: { backgroundColor: "purple" },
      }}
    >
      <DatesProvider settings={{ consistentWeeks: true }}>
        <Calendar
          firstDayOfWeek={0}
          size="lg"
          maxLevel="month"
          styles={{
            calendarHeader: {
              backgroundColor: "red",
              minWidth: "100%",
            },
            calendarHeaderLevel: {
              backgroundColor: "orange",
            },
            month: {
              backgroundColor: "green",
              width: "100%",
            },
            levelsGroup: {
              justifyContent: "center",
              width: "100%",
              backgroundColor: "yellow",
            },
            day: {
              border: "solid",
              height: "auto",
              width: "100%",
            },
          }}
          renderDay={(date) => {
            const day = date.getDate();
            return (
              <Stack align="center" justify="center">
                <div>{day}</div>
                <div>AM</div>
                <div>PM</div>
              </Stack>
            );
          }}
        ></Calendar>
      </DatesProvider>
    </Paper>
  );
}
