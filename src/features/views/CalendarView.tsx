// Virtualized.tsx

// React and libraries
import { useEffect, useMemo, useRef } from "react";
import { addMonths, startOfMonth } from "date-fns";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowRenderer,
} from "react-virtualized";

// Styles
import "react-day-picker/dist/style.css";

// App Components
import CustomDayPicker from "@/features/components/CustomDayPicker";

// Contexts
import { useHeaderContext, HeaderType } from "@/context/HeaderContext";
import { useMenuContext } from "@/context/MenuContext";
import { useScheduleContext } from "@/context/ScheduleContext";
// import { useSessionContext } from "@/context/SessionContext";
import { useSelectedDayContext } from "@/context/SelectedDayContext";

//  Theme / Config
// import { zIndex } from "@/themes/zindex";

type CalendarViewProps = {
  currentMonthLabel?: string;
  headerType?: HeaderType;
};

// Constants
const YEARS_TO_RENDER = 2;
const START_YEAR = new Date().getFullYear() - 1;
const START_MONTH = 3; // April (0-indexed)
const START_OFFSET_DATE = new Date(START_YEAR, START_MONTH, 1);
const TOTAL_MONTHS = 12 * YEARS_TO_RENDER;
const OVERSCAN_ROW_COUNT = 2;
const DAY_CELL_HEIGHT_REM = 6;
const PADDING = "0.3rem";

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

const getDateOffset = (baseDate: Date | undefined) => {
  const today = startOfMonth(baseDate ?? new Date());
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

export default function CalendarView({
  headerType = "calendar",
}: CalendarViewProps) {
  // Hooks
  const { selectedDay } = useSelectedDayContext();

  const { headerHeight, setHeaderType, setContextualHeaderTitle } =
    useHeaderContext();
  const { menuHeight } = useMenuContext();
  const { schedule } = useScheduleContext();
  const todayOffset = useMemo(() => getDateOffset(selectedDay), [selectedDay]);
  const listRef = useRef<List | null>(null);
  const initialScrollRow = useRef<number>(todayOffset);
  const lastVisibleIndex = useRef<number>(-1);
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

  // Side Effects
  useEffect(() => {
    console.log(selectedDay);
    setHeaderType(headerType);
  }, []);

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

          setContextualHeaderTitle(
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

  return (
    <>
      <div
        style={{
          height: `calc(100vh - ${menuHeight}px)`,
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
    </>
  );
}
