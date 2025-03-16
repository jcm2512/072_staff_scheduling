import { Paper, Stack } from "@mantine/core";
import { Calendar, DatesProvider, MonthPicker } from "@mantine/dates";

export function CalendarView() {
  return (
    <Paper shadow="xs" p="md">
      <DatesProvider settings={{ consistentWeeks: true }}>
        <Calendar
          firstDayOfWeek={0}
          size="lg"
          maxLevel="month"
          styles={{
            calendarHeader: {
              minWidth: "100%",
            },
            calendarHeaderLevel: {},
            month: {
              width: "100%",
            },
            levelsGroup: {
              justifyContent: "center",
              width: "100%",
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
