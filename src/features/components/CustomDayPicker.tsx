// React and libraries
import { DayPicker } from "react-day-picker";
import { Stack, Text, Title } from "@mantine/core";

// Styles
import "react-day-picker/dist/style.css";

// Constants
const PADDING_SM = "0.3rem";
const MONTH_CAPTION_HEIGHT = 36;

type CustomDayPickerProps = {
  month: Date;
  cellHeight: number;
  schedule: any;
};

export default function CustomDayPicker({
  month,
  cellHeight,
  schedule,
}: CustomDayPickerProps) {
  return (
    <DayPicker
      styles={{
        day: { padding: "0" },
        week: { borderTop: "1px solid #eaeaea" },
        months: { maxWidth: "100%" },
        month: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
        },
        month_grid: { flexGrow: "1" },
      }}
      mode="multiple"
      month={month}
      hideWeekdays
      hideNavigation
      modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
      components={{
        MonthCaption(props) {
          return (
            <Title
              order={5}
              style={{
                paddingLeft: PADDING_SM,
                height: MONTH_CAPTION_HEIGHT,
              }}
            >
              {props.calendarMonth.date.toLocaleString("en", {
                month: "long",
              })}
            </Title>
          );
        },
        DayButton(props) {
          const date = new Date(props.day.date);
          const dayNum = String(date.getDate()).padStart(2, "0");
          const fullDate = date.toISOString().split("T")[0];

          const daySchedule = schedule[fullDate] || {};

          return (
            <Stack
              align="center"
              style={{ height: `${cellHeight}rem`, width: "100%" }}
              gap={0}
            >
              <Text
                className="DayNum"
                size="sm"
                style={{
                  fontWeight: "300",
                  alignSelf: "flex-start",
                  paddingLeft: PADDING_SM,
                }}
              >
                {dayNum}
              </Text>

              <Text
                c={daySchedule.am === "Office" ? "black" : "#1A535C"}
                inline
                size="xs"
                m="0.5vh"
                bg={daySchedule.am === "Office" ? "lightgrey" : "#4ECDC4"}
                style={{
                  width: "90%",
                  borderRadius: PADDING_SM,
                  textAlign: "center",
                  lineHeight: "1.3rem",
                  fontWeight: "500",
                }}
              >
                {daySchedule.am || ""}
              </Text>

              <Text
                c={daySchedule.pm === "Office" ? "black" : "#055561"}
                bg={daySchedule.pm === "Office" ? "lightgrey" : "#C4F5FC"}
                inline
                size="xs"
                m="0.5vh"
                style={{
                  width: "90%",
                  borderRadius: PADDING_SM,
                  textAlign: "center",
                  lineHeight: "1.3rem",
                  fontWeight: "bold",
                }}
              >
                {daySchedule.pm || ""}
              </Text>
            </Stack>
          );
        },
      }}
    />
  );
}
