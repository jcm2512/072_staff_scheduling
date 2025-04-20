// Virtualized.tsx
import logo from "@/assets/shiftori_logo.png";

// React and libraries
import { useRef, useMemo, useState, useEffect } from "react";
import { addMonths, startOfMonth } from "date-fns";

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

import CustomDayPicker from "@/features/components/CustomDayPicker";

// DEBUG

// Constants
const YEARS_TO_RENDER = 2;
const START_YEAR = new Date().getFullYear() - 1;
const START_MONTH = 3; // April (0-indexed)
const START_OFFSET_DATE = new Date(START_YEAR, START_MONTH, 1);
const TOTAL_MONTHS = 12 * YEARS_TO_RENDER;
const OVERSCAN_ROW_COUNT = 2;
const HEADER_HEIGHT = 60;

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
          <CustomDayPicker month={month} />
        </div>
      </CellMeasurer>
    );
  };

  // FIXES scroll jump on scrolling previous months
  useEffect(() => {
    const firstRow = initialScrollRow.current - OVERSCAN_ROW_COUNT;
    const lastRow = initialScrollRow.current + OVERSCAN_ROW_COUNT;

    for (let i = firstRow; i <= lastRow; i++) {
      if (i >= 0 && i < TOTAL_MONTHS) {
        cache.clear(i, 0);
        listRef.current?.recomputeRowHeights(i);
      }
    }
  }, []);

  return (
    <div
      style={{
        flex: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
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

      <div
        id="body"
        style={{
          flex: 1,
          position: "relative",
          overflow: "auto",
        }}
      >
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
