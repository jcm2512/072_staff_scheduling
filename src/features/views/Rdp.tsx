// React and libraries
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  Component,
  ReactNode,
} from "react";
import { Stack, Text, Loader, Center, Title } from "@mantine/core";
import { DayPicker, DayButtonProps } from "react-day-picker";
import { addMonths, startOfMonth, format } from "date-fns";
import { collection, onSnapshot } from "firebase/firestore";

// App-specific imports
import { db } from "@/firebaseConfig";
import { useEmployeeId } from "@/hooks/useEmployeeId";

// Styles
import "react-day-picker/dist/style.css";

type RdpProps = {
  onMonthChange?: (date: Date) => void;
  schedule?: Record<string, Record<string, any>>; // All months' data
  date?: Date;
};

type DaySchedule = {
  am?: string;
  pm?: string;
  allday?: boolean;
  irregular?: boolean;
};

const MONTH_HEIGHT = 360;
const INITIAL_RANGE = 12;
const LOAD_MONTHS = 3;

const PADDING_SM = "0.3rem";

export default function Rdp({ onMonthChange, date }: RdpProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<Date[] | undefined>([]);
  const [startIndex, setStartIndex] = useState(-6); // 6 months before today
  const [endIndex, setEndIndex] = useState(18); // 18 months after

  const lastLoggedMonth = useRef<number | null>(null);
  const monthRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [currentMonthLabel, setCurrentMonthLabel] = useState<string>("");

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const { employeeId, loading } = useEmployeeId();
  const [fetchedSchedule, setFetchedSchedule] = useState(false);

  const [isCalendarReady, setIsCalendarReady] = useState(false);

  const months = useMemo(() => {
    return Array.from(
      { length: endIndex - startIndex + 1 },
      (_, i) => startIndex + i
    );
  }, [startIndex, endIndex]);

  // Scroll to today's month
  const scrollToToday = (smooth: boolean = true) => {
    const todayOffset = 0;
    const el = monthRefs.current[todayOffset];
    if (el && containerRef.current) {
      const scrollTop = el.offsetTop - containerRef.current.offsetTop;
      if (smooth) {
        containerRef.current.scrollTo({ top: scrollTop, behavior: "smooth" });
      } else {
        containerRef.current.scrollTop = scrollTop;
      }
    }
  };

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

  // Scroll logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      // Lazy Load Future Months
      if (scrollTop + clientHeight >= scrollHeight - MONTH_HEIGHT) {
        setEndIndex((prev) => prev + LOAD_MONTHS);
      }

      // Lazy Load Past Months
      if (scrollTop <= MONTH_HEIGHT) {
        const topVisibleMonth = Object.entries(monthRefs.current)
          .map(([offset, el]) => {
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            const distanceFromTop = Math.abs(
              rect.top - container.getBoundingClientRect().top
            );
            return { offset: parseInt(offset), el, distance: distanceFromTop };
          })
          .filter(Boolean)
          .sort((a, b) => a!.distance - b!.distance)[0];

        setStartIndex((prev) => prev - LOAD_MONTHS);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (topVisibleMonth?.el && container) {
              const offsetY =
                topVisibleMonth.el.offsetTop - container.offsetTop;
              container.scrollTop = offsetY;
            }
          });
        });
      }

      // Update current visible month
      const rects = Object.entries(monthRefs.current)
        .map(([offset, el]) => {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const distanceFromTop = Math.abs(
            rect.top - container.getBoundingClientRect().top
          );
          return { offset: parseInt(offset), distance: distanceFromTop };
        })
        .filter(Boolean)
        .sort((a, b) => a!.distance - b!.distance);

      const closest = rects[0];
      if (closest && closest.offset !== lastLoggedMonth.current) {
        const visibleMonth = addMonths(
          startOfMonth(new Date()),
          closest.offset
        );
        // setCurrentMonthLabel(format(visibleMonth, "MMMM yyyy"));
        lastLoggedMonth.current = closest.offset;

        if (onMonthChange) {
          onMonthChange(visibleMonth); // 🔥 trigger parent update
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [startIndex, endIndex]);

  useEffect(() => {
    if (!fetchedSchedule) return;

    const timeout = setTimeout(() => {
      const todayEl = monthRefs.current[0];
      if (todayEl && containerRef.current) {
        scrollToToday(false);
        setIsCalendarReady(true); // ✅ reveal calendar only when ready
      } else {
        console.warn("monthRefs not ready yet.");
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [fetchedSchedule]);

  // Scroll to the month passed via date prop whenever the prop changes
  useEffect(() => {
    if (date) {
      scrollToMonth(date);
    }
  }, [date]);

  const LoadingScreen: React.FC = () => {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" color="teal" />
      </Center>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Scrollable Calendar */}
      {loading || !fetchedSchedule ? <LoadingScreen /> : <></>}
      <div
        ref={containerRef}
        style={{
          height: "100%",
          overflowY: "scroll",
          visibility: isCalendarReady ? "visible" : "hidden",
        }}
      >
        {months.map((offset) => {
          const month = addMonths(startOfMonth(new Date()), offset);
          return (
            <div key={offset}>
              <div
                ref={(el) => {
                  monthRefs.current[offset] = el;
                }}
                style={{ height: "1px" }} // or 1px if 0 causes issues
              />
              <DayPicker
                styles={{
                  months: {
                    maxWidth: "100%",
                  },
                  month: {
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  },
                  month_grid: { flexGrow: "1" },
                }}
                mode="multiple"
                required={false}
                month={month}
                selected={selected}
                onSelect={setSelected}
                hideWeekdays
                hideNavigation
                components={{
                  MonthCaption(props) {
                    return (
                      <Title
                        order={5}
                        style={{
                          paddingLeft: PADDING_SM,
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
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const dayNum = String(date.getDate()).padStart(2, "0");
                    const fullDate = `${year}-${month}-${dayNum}`;

                    const daySchedule = schedule[fullDate] || {};

                    return (
                      <Stack
                        align="center"
                        style={{ height: "6rem", width: "100%" }}
                        gap={0}
                      >
                        <Text
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
                          bg={
                            daySchedule.am === "Office"
                              ? "lightgrey"
                              : "#4ECDC4"
                          }
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
                          bg={
                            daySchedule.pm === "Office"
                              ? "lightgrey"
                              : "#C4F5FC"
                          }
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
