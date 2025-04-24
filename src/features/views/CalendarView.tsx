// Virtualized.tsx

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
import { useHeaderContext } from "@/context/HeaderContext";
import { useMenuContext } from "@/context/MenuContext";

// Styles
import "react-day-picker/dist/style.css";

// Hooks
import { useEmployeeId } from "@/hooks/useEmployeeId";

// Components
import CustomDayPicker from "@/features/components/CustomDayPicker";

// Database
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

import { Drawer, Text, Switch } from "@mantine/core";

import { useSelectedDayContext } from "@/context/SelectedDayContext";
import { useDisclosure } from "@mantine/hooks";

import { useScheduleContext } from "@/context/ScheduleContext";
import { useUserPrefsContext } from "@/context/UserPrefsContext";

import DayDrawerComponent from "@/features/components/DayDrawerComponent";
import { zIndex } from "@/themes/zindex";
import { useNavigate } from "react-router-dom";

import { HeaderType } from "@/context/HeaderContext";

// DEBUG

type CalendarViewProps = {
  currentMonthLabel?: string;
  setCurrentMonthLabel: (label: string) => void;
  headerType?: HeaderType;
};

type DaySchedule = {
  am?: string;
  pm?: string;
  allday?: boolean;
  irregular?: boolean;
};

// DEBUG
const DEBUG = true;

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
  const { newDaySchedule, setNewDaySchedule } = useUserPrefsContext();

  const { headerHeight, setHeaderType } = useHeaderContext();
  const { menuHeight } = useMenuContext();
  const { employeeId, loading } = useEmployeeId();
  const { schedule, setSchedule } = useScheduleContext(); ///  <-WWWIPP
  const [fetchedSchedule, setFetchedSchedule] = useState(false);
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

  // Open drawer when selectedDay is set (not undefined)
  useEffect(() => {
    if (!selectedDay) return;
    if (newDaySchedule) {
      navigate("/day");
    } else {
      open();
    }
  }, [selectedDay, newDaySchedule, open, navigate]);

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
          const days = data?.days ?? {};

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
      <Switch
        checked={newDaySchedule}
        onChange={(event) => setNewDaySchedule(event.currentTarget.checked)}
        size="lg"
        onLabel="V2"
        offLabel="V1"
        style={{
          display: "block",
          position: "absolute",
          zIndex: zIndex.fixed,
          top: 100,
          left: 20,
        }}
        defaultChecked
      />
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
