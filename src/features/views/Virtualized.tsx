// Rdp.tsx
import logo from "@/assets/shiftori_logo.png";

// React and libraries
import { useRef, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { addMonths, startOfMonth } from "date-fns";
import {
  Stack,
  Text,
  Loader,
  Center,
  Title,
  Group,
  Box,
  Burger,
} from "@mantine/core";

import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

import { ListRowRenderer } from "react-virtualized";

// Layouts
import Header from "@/features/components/Header";

// Styles
import "react-day-picker/dist/style.css";

// Hooks
import { useMediaQuery } from "@mantine/hooks";

// Constants
const getMonthFromOffset = (offset: number) =>
  addMonths(startOfMonth(new Date()), offset);

const TOTAL_MONTHS = 100;

const HEADER_HEIGHT = 60;
const MONTH_HEIGHT = 360;
const LOAD_MONTHS = 3;
const PADDING_SM = "0.3rem";
const DaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_CAPTION_HEIGHT = 36;

export default function Virtualized() {
  const [currentMonthLabel, setCurrentMonthLabel] = useState("");

  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const months = useMemo(
    () => Array.from({ length: TOTAL_MONTHS }, (_, i) => i),
    []
  );
  // Cache to dynamically measure height
  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 360,
      fixedWidth: true,
    })
  ).current;

  const rowRenderer: ListRowRenderer = ({ index, key, style, parent }) => {
    const month = getMonthFromOffset(index);

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        rowIndex={index}
        key={key}
        parent={parent}
      >
        <div style={style}>
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
            // selected={selected}
            // onSelect={setSelected}
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

                // const daySchedule = schedule[fullDate] || {};

                return (
                  <Stack
                    align="center"
                    style={{ height: "6rem", width: "100%" }}
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
                      //   c={daySchedule.am === "Office" ? "black" : "#1A535C"}
                      inline
                      size="xs"
                      m="0.5vh"
                      //   bg={daySchedule.am === "Office" ? "lightgrey" : "#4ECDC4"}
                      style={{
                        width: "90%",
                        borderRadius: PADDING_SM,
                        textAlign: "center",
                        lineHeight: "1.3rem",
                        fontWeight: "500",
                      }}
                    >
                      {/* {daySchedule.am || ""} */}
                    </Text>

                    <Text
                      //   c={daySchedule.pm === "Office" ? "black" : "#055561"}
                      //   bg={daySchedule.pm === "Office" ? "lightgrey" : "#C4F5FC"}
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
                      {/* {daySchedule.pm || ""} */}
                    </Text>
                  </Stack>
                );
              },
            }}
          />
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header
        {...{
          isMobile,
          HEADER_HEIGHT,
          logo,
          CONTEXTUAL_TITLE: currentMonthLabel,
        }}
      />
      <div id="body" style={{ flex: 1, overflow: "hidden" }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={months.length}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              overscanRowCount={2}
              onRowsRendered={({ startIndex }) => {
                const visibleMonth = getMonthFromOffset(startIndex);
                setCurrentMonthLabel(
                  visibleMonth.toLocaleString("en", {
                    month: "long",
                    year: "numeric",
                  })
                );
              }}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
