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
  return (
    <>
      <Calendar
        defaultDate={date}
        firstDayOfWeek={0}
        withCellSpacing={false}
        maxLevel="month"
        style={{
          // parent component
          height: "100%", // slide fills the entire height of container
        }}
        styles={{
          calendarHeaderControl: {
            display: "none", // removes controls to switch months (use carousel instead)
          },
          calendarHeader: {
            display: "none", // try to hide header so month cells can fill entire slide
            minWidth: "100%", // centers the month header
          },
          calendarHeaderLevel: {
            fontSize: "var(--mantine-font-size-xl)",
          },
          weekday: {
            display: "none",
            background: "blue",
          },
          month: {
            // parent of monthTbody - handles day labels and overall width of month
            width: "100%", // month fills entire width of slide
            height: "100%", // IMPORTANT setting height to 100% clashes with setting monthCell to 100%
          },
          monthTbody: {
            // overlays ontop of month
            borderStyle: "hidden", // removes outside border on table
            height: "100%",
            background: "blue",
          },
          levelsGroup: {
            // child of Calendar component //

            // --- rounded border --- //
            // border: "1px solid #eaeaea", // border around each month card
            // borderRadius: `var(--mantine-radius-lg)`,
            // overflow: "hidden", // forces border radius to clip content
            // ---

            backgroundColor: "white", // color of month card
            height: "100%", // to fill parent Calendar component

            border: "3px solid red",
          },

          monthCell: {
            // IMPORTANT setting height to 100% clashes with setting month to 100%
            borderWidth: "1px", //collapses surrounding cell borders
            border: "solid 1px #eaeaea",
            lineHeight: "0", // override default line height
          },
          day: {
            // height: "12vh",
            // height: "100%",
            width: "100%", // centers content
            overflow: "hidden",
            display: "flex", // fixes content from being default baseline aligned (keeps cells the same size)
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
