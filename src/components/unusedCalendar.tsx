import { Stack, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";

type CalendarComponentProps = {
  schedule: Record<string, any>;
};

export function CalendarComponent({ schedule }: CalendarComponentProps) {
  const myDate = new Date(2025, 0);
  return (
    <Calendar
      defaultDate={myDate}
      firstDayOfWeek={0}
      withCellSpacing={false}
      maxLevel="month"
      style={{
        borderSpacing: "0",
        height: "fit-content",
      }}
      styles={{
        calendarHeader: {
          minWidth: "100%",
          margin: "0px", // remove empty space between calendar header and body
        },
        month: {
          width: "100%",
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
    />
  );
}
