// Virtualized.tsx
import logo from "@/assets/shiftori_logo.png";

// React and libraries
import { useRef, useMemo, useState, useEffect } from "react";
import { addMonths, startOfMonth } from "date-fns";
import { Text } from "@mantine/core";

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
import { useEmployeeId } from "@/hooks/useEmployeeId";

// Components
import CustomDayPicker from "@/features/components/CustomDayPicker";

// Database
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";

// DEBUG

// Constants
const YEARS_TO_RENDER = 2;
const START_YEAR = new Date().getFullYear() - 1;
const START_MONTH = 3; // April (0-indexed)
const START_OFFSET_DATE = new Date(START_YEAR, START_MONTH, 1);
const TOTAL_MONTHS = 12 * YEARS_TO_RENDER;
const OVERSCAN_ROW_COUNT = 2;
const DAY_CELL_HEIGHT_REM = 6;
const PADDING = "0.3rem";

type DaySchedule = {
  am?: string;
  pm?: string;
  allday?: boolean;
  irregular?: boolean;
};

// Memoized function
const getMonthFromOffset = (() => {
  const cache = new Map<number, Date>();
  return (offset: number) => {
    if (!cache.has(offset)) {
      cache.set(offset, addMonths(startOfMonth(START_OFFSET_DATE), offset));
    }
    return cache.get(offset)!;
  };
})();

const getTodayOffset = () => {
  const today = startOfMonth(new Date());
  const diff =
    (today.getFullYear() - START_OFFSET_DATE.getFullYear()) * 12 +
    (today.getMonth() - START_OFFSET_DATE.getMonth());
  return diff;
};

const remToPx = (rem: number): number => {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return rem * rootFontSize;
};

const DAY_CELL_HEIGHT_PX = remToPx(DAY_CELL_HEIGHT_REM);

export default function Virtualized() {
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const [headerHeight, setHeaderHeight] = useState<number>(60); // Fallback height

  const { employeeId, loading } = useEmployeeId();
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const [fetchedSchedule, setFetchedSchedule] = useState(false);

  const todayOffset = useMemo(() => getTodayOffset(), []);

  const listRef = useRef<List | null>(null);
  const initialScrollRow = useRef<number>(todayOffset);
  const lastVisibleIndex = useRef<number>(-1);
  const [currentMonthLabel, setCurrentMonthLabel] = useState("");
  const isMobile = useMediaQuery(`(max-width: 768px)`);

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

  const handleScroll = ({ scrollTop }: { scrollTop: number }) => {
    let y = 0;
    // loop though all months
    for (let i = 0; i < TOTAL_MONTHS; i++) {
      const rowHeight = cache.rowHeight({ index: i });

      // check which month is visble
      if (y + rowHeight > scrollTop + headerHeight + DAY_CELL_HEIGHT_PX) {
        // only set the current month if different from previous
        // prevents updating on every tick
        if (lastVisibleIndex.current !== i) {
          lastVisibleIndex.current = i;
          const visibleMonth = getMonthFromOffset(i);
          setCurrentMonthLabel(
            visibleMonth.toLocaleString("en", {
              month: "long",
              year: "numeric",
            })
          );
        }
        break;
      }
      y += rowHeight;
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
          <CustomDayPicker
            PADDING={PADDING}
            month={month}
            cellHeight={DAY_CELL_HEIGHT_REM}
            schedule={schedule}
          />
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

  useEffect(() => {
    if (!employeeId) return;
    const scheduleCollectionRef = collection(
      db,
      "companies",
      "companyId02",
      "teacher",
      employeeId,
      "monthlySchedule"
    );

    const unsubscribe = onSnapshot(scheduleCollectionRef, (snapshot) => {
      let mergedDays: Record<string, DaySchedule> = {};

      snapshot.forEach((docSnapshot: any) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const days = data ?? {};

          mergedDays = {
            ...mergedDays,
            ...days,
          };
        }
      });

      setSchedule(mergedDays);
      setFetchedSchedule(true);
    });

    return () => unsubscribe();
  }, [employeeId]);

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
          setHeaderHeight,
          PADDING,
          isMobile,
          logo,
          CONTEXTUAL_TITLE: currentMonthLabel,
        }}
      />

      <div
        id="body"
        ref={bodyRef}
        style={{
          flex: 1,
          position: "relative",
          overflow: "auto",
        }}
      >
        <AutoSizer>
          {({ height, width }) => {
            return (
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
                scrollToAlignment="auto"
                onScroll={handleScroll}
                className="hideScrollBar"
              />
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
}
