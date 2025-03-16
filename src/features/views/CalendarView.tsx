import { useState } from "react";
import {
  Group,
  Grid,
  Text,
  Paper,
  Indicator,
  Stack,
  Flex,
} from "@mantine/core";
import { Calendar, DatesProvider, MonthPicker } from "@mantine/dates";
import dayjs from "dayjs";

export function CalendarView() {
  return (
    <Paper shadow="xs" p="md" w={"100%"}>
      <DatesProvider settings={{ consistentWeeks: true }}>
        <Calendar
          firstDayOfWeek={0}
          size="lg"
          maxLevel="month"
          static
          styles={{
            levelsGroup: {
              justifyContent: "center",
            },
            day: {
              border: "solid",
              height: "auto",
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
