import { Stack, Text, em } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";

type CalendarComponentProps = {
  isMobile?: boolean;
  schedule: any;
  date?: Date;
  swipe?: boolean;
};

export function CalendarComponent({
  schedule,
  date = new Date(),
}: CalendarComponentProps) {
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);

  return (
    <>
      <Calendar
        defaultDate={date}
        firstDayOfWeek={0}
        withCellSpacing={false}
        maxLevel="month"
        style={{
          border: "3px solid green",
          // height: "100%",
        }}
        styles={{
          calendarHeaderControl: {
            display: "none",
          },
          calendarHeader: {
            // minWidth: "100%",
            padding: "var(--mantine-font-size-xs)",
          },
          calendarHeaderLevel: {
            fontSize: "var(--mantine-font-size-xl)",
          },
          month: {
            width: "100%", // month fills entire width of slid
          },

          monthTbody: {
            borderStyle: "hidden", // removes outside border on table
          },
          levelsGroup: {
            justifyContent: "center",
            // width: "100%",
            border: "1px solid #eaeaea",
            borderRadius: `var(--mantine-radius-lg)`,
            overflow: "hidden",
            boxSizing: "border-box",
            backgroundColor: "white",
          },

          monthCell: {
            borderWidth: "1px",
            border: "solid 1px #eaeaea",
            lineHeight: "0",
          },
          day: {
            // height: "12vh",
            // width: "100%",
            overflow: "hidden",
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
            <Stack
              align="center"
              // style={{ height: "100%", width: "100%" }}
              gap={0}
            >
              <Text size="sm" style={{ fontWeight: "300" }}>
                {day}
              </Text>

              <Text
                c={daySchedule.am == "Office" ? "black" : "#1A535C"}
                inline={true}
                size="xs"
                m={"0.5vh"}
                bg={daySchedule.am == "Office" ? "lightgrey" : "#4ECDC4"}
                style={{
                  width: "90%",
                  borderRadius: "0.3rem",
                  textAlign: "center",
                  lineHeight: "1.3rem",
                  fontWeight: "500",
                }}
              >
                {daySchedule.am || ""}
              </Text>
              <Text
                c={daySchedule.pm == "Office" ? "black" : "#055561"}
                bg={daySchedule.pm == "Office" ? "lightgrey" : "#C4F5FC"}
                inline={true}
                size="xs"
                m={"0.5vh"}
                style={{
                  width: "90%",
                  borderRadius: "0.3rem",
                  textAlign: "center",
                  lineHeight: "1.3rem",
                  fontWeight: "bold",
                }}
              >
                {daySchedule.pm || ""}
              </Text>
            </Stack>
          );
        }}
      ></Calendar>
    </>
  );
}
