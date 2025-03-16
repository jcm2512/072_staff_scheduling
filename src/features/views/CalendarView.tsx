import { Paper, Stack, Text } from "@mantine/core";
import { Calendar, DatesProvider } from "@mantine/dates";

export function CalendarView() {
  return (
    <Paper shadow="xs" p="md">
      <DatesProvider settings={{ consistentWeeks: true }}>
        <Calendar
          firstDayOfWeek={0}
          size="xl"
          withCellSpacing={false}
          maxLevel="month"
          styles={{
            calendarHeader: {
              minWidth: "100%",
            },
            month: {
              width: "100%",
            },
            levelsGroup: {
              justifyContent: "center",
              width: "100%",
            },
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
            const day = date.getDate();
            return (
              <Stack align="center" justify="center">
                <div>{day}</div>
                <Stack align="center" justify="center">
                  <Text c={"blue"}>AM</Text>
                  <Text c={"green"}>AM</Text>
                </Stack>
              </Stack>
            );
          }}
        ></Calendar>
      </DatesProvider>
    </Paper>
  );
}
