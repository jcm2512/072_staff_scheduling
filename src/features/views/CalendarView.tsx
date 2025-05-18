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
import { useNavigate } from "react-router-dom";

// Styles
import "react-day-picker/dist/style.css";

// UI Components
import { Drawer, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// App Components
import CustomDayPicker from "@/features/components/CustomDayPicker";
import DayDrawerComponent from "@/features/components/DayDrawerComponent";

// Contexts
import { useHeaderContext, HeaderType } from "@/context/HeaderContext";
import { useMenuContext } from "@/context/MenuContext";
import { useScheduleContext } from "@/context/ScheduleContext";
import { useSelectedDayContext } from "@/context/SelectedDayContext";
import { useUserPrefsContext } from "@/context/UserPrefsContext";

//  Theme / Config
// import { zIndex } from "@/themes/zindex";

type CalendarViewProps = {
  currentMonthLabel?: string;
  setCurrentMonthLabel: (label: string) => void;
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

export default function CalendarView({
  setCurrentMonthLabel,
  headerType = "calendar",
}: CalendarViewProps) {
  // Hooks
  const navigate = useNavigate();

  const { selectedDay } = useSelectedDayContext();
  const [opened, { open, close }] = useDisclosure(false);
  // const { newDaySchedule } = useUserPrefsContext();

  const { headerHeight, setHeaderType } = useHeaderContext();
  const { menuHeight } = useMenuContext();
  const { schedule } = useScheduleContext();
  const todayOffset = useMemo(() => getTodayOffset(), []);
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
    setHeaderType(headerType);
  }, []);

  // reset selectedDay when loading page
  useEffect(() => {
    if (!selectedDay) return;
    navigate("/day");
  }, [selectedDay, open, navigate]);

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

  return (
    <>
      <Drawer
        position="bottom"
        size={"90%"}
        zIndex={10000}
        opened={opened}
        onClose={close}
        title={
          <Text style={{ fontWeight: 700 }}>
            {selectedDay?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        }
        overlayProps={{ backgroundOpacity: 0.2, blur: 3 }}
        styles={{
          content: {
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
          body: {
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          },
        }}
      >
        <DayDrawerComponent></DayDrawerComponent>
      </Drawer>

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
