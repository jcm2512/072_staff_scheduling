import { useState } from "react";
import { Group, SimpleGrid, Grid, Text, Paper } from "@mantine/core";
import { MonthPicker } from "@mantine/dates";
import dayjs from "dayjs";

export function MonthView() {
  const [value, setValue] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date | null): number[] => {
    if (!date) return [];
    const days: number[] = [];
    const endOfMonth = dayjs(date).endOf("month");

    for (let i = 1; i <= endOfMonth.date(); i++) {
      days.push(i);
    }

    return days;
  };

  const days = getDaysInMonth(value);

  return (
    <Paper shadow="xs" p="md" w={"100%"}>
      <>
        <Group justify="center" mb="md">
          <MonthPicker
            value={value}
            onChange={setValue}
            maxLevel="year"
          ></MonthPicker>
        </Group>
        {/* <SimpleGrid cols={2} spacing="xs"> */}
        <Grid columns={10}>
          {days.map((day, index) => {
            const date = day ? dayjs(value).date(day) : null;
            const dayOfWeek = date ? date.format("ddd") : "";
            const isWeekend = date
              ? date.day() === 0 || date.day() === 6
              : false;

            return (
              <>
                <Grid.Col span={2}>
                  <Group
                    key={`container-${index}`}
                    style={{
                      backgroundColor: isWeekend ? "#ffeded" : "transparent",
                      borderRadius: "4px",
                      padding: "5px",
                      gridTemplateColumns: "30px 1fr",
                    }}
                  >
                    <Text
                      key={`d-${index}`}
                      fw={isWeekend ? 700 : 400}
                      c={isWeekend ? "red" : "black"}
                    >
                      {day}
                    </Text>
                    <Text key={`ddd-${index}`} c={isWeekend ? "red" : "gray"}>
                      {dayOfWeek}
                    </Text>
                  </Group>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Text key={`event-${index}`}>
                    {/* Placeholder for events */}
                  </Text>
                </Grid.Col>
              </>
            );
          })}
          {/* </SimpleGrid> */}
        </Grid>
      </>
    </Paper>
  );
}
