// Virtualized.tsx
import logo from "@/assets/shiftori_logo.png";

// React and libraries
import { useRef, useMemo, useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { addMonths, startOfMonth } from "date-fns";
import { Stack, Text, Title } from "@mantine/core";

import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  ListRowRenderer,
} from "react-virtualized";

// Layouts
import Header from "@/features/components/Header";

// Styles
import "react-day-picker/dist/style.css";

// Hooks
import { useMediaQuery } from "@mantine/hooks";

// DEBUG

// Constants
const YEARS_TO_RENDER = 2;
const START_YEAR = new Date().getFullYear() - 1;
const START_MONTH = 3; // April (0-indexed)
const START_OFFSET_DATE = new Date(START_YEAR, START_MONTH, 1);
const TOTAL_MONTHS = 12 * YEARS_TO_RENDER;
const OVERSCAN_ROW_COUNT = 2;
const HEADER_HEIGHT = 60;
const PADDING_SM = "0.3rem";
const MONTH_CAPTION_HEIGHT = 36;

const getMonthFromOffset = (offset: number) =>
  addMonths(startOfMonth(START_OFFSET_DATE), offset);

const getTodayOffset = () => {
  const today = startOfMonth(new Date());
  const diff =
    (today.getFullYear() - START_OFFSET_DATE.getFullYear()) * 12 +
    (today.getMonth() - START_OFFSET_DATE.getMonth());
  return diff;
};

export default function Virtualized() {
  const todayOffset = useMemo(() => getTodayOffset(), []);

  const listRef = useRef<List | null>(null);
  const initialScrollRow = useRef<number>(todayOffset); // or todayOffset, etc.
  const [currentMonthLabel, setCurrentMonthLabel] = useState("");
  const hasScrolled = useRef(false);
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  //   const containerRef = useRef<HTMLDivElement | null>(null);

  const months = useMemo(
    () => Array.from({ length: TOTAL_MONTHS }, (_, i) => i),
    []
  );

  // Cache to dynamically measure height
  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 200,
      fixedWidth: true,
    })
  ).current;

  const handleRowsRendered = ({
    startIndex,
    stopIndex,
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    // 1. Update current visible month label
    const visibleMonth = getMonthFromOffset(startIndex);
    setCurrentMonthLabel(
      visibleMonth.toLocaleString("en", {
        month: "long",
        year: "numeric",
      })
    );

    // 2. Perform initial scroll correction if needed
    if (
      !hasScrolled.current &&
      initialScrollRow.current >= startIndex &&
      initialScrollRow.current <= stopIndex
    ) {
      cache.clear(initialScrollRow.current, 0);
      listRef.current?.recomputeRowHeights(initialScrollRow.current);
      listRef.current?.scrollToRow(initialScrollRow.current);
      hasScrolled.current = true;
      console.log("✅ Final scroll triggered to:", initialScrollRow.current);
    }
  };

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
                // const fullDate = date.toISOString().split("T")[0];

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

  // FIXES scroll jump on scrolling previous months
  useEffect(() => {
    const range = 2 * OVERSCAN_ROW_COUNT + 1; // overscan above + overscan below + current month
    for (
      let i = Math.max(0, initialScrollRow.current - range);
      i <= Math.min(TOTAL_MONTHS - 1, initialScrollRow.current + range);
      i++
    ) {
      cache.clear(i, 0);
      listRef.current?.recomputeRowHeights(i);
    }
  }, []);

  return (
    <div
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
              ref={listRef}
              width={width}
              height={height}
              rowCount={months.length}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              overscanRowCount={OVERSCAN_ROW_COUNT}
              scrollToIndex={initialScrollRow.current}
              scrollToAlignment="start"
              onRowsRendered={handleRowsRendered}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
