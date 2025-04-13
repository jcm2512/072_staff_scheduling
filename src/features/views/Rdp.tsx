// Rdp.tsx
import logo from "@/assets/shiftori_logo.png";

// React and libraries
import { useState, useMemo, useRef, useEffect } from "react";
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
import { DayPicker } from "react-day-picker";
import { addMonths, startOfMonth } from "date-fns";
import { collection, onSnapshot } from "firebase/firestore";

// App-specific imports
import { db } from "@/firebaseConfig";
import { useEmployeeId } from "@/hooks/useEmployeeId";

// utils
import { debounce } from "@/utils/debounce"; // Adjust path as needed

// Styles
import "react-day-picker/dist/style.css";
import "./rdp.css";

// Hooks
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

// Constants
const MONTH_HEIGHT = 360;
const LOAD_MONTHS = 3;
const PADDING_SM = "0.3rem";
const DaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_CAPTION_HEIGHT = 36;

type RdpProps = {
  schedule?: Record<string, Record<string, any>>;
  date?: Date;
};

type DaySchedule = {
  am?: string;
  pm?: string;
  allday?: boolean;
  irregular?: boolean;
};

export default function Rdp({}: RdpProps) {
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<Date[] | undefined>([]);
  const [startIndex, setStartIndex] = useState(-LOAD_MONTHS);
  const [endIndex, setEndIndex] = useState(LOAD_MONTHS);
  const lastLoggedMonth = useRef<number | null>(null);
  const monthRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const { employeeId, loading } = useEmployeeId();
  const [fetchedSchedule, setFetchedSchedule] = useState(false);
  const [isCalendarReady, setIsCalendarReady] = useState(false);
  const HEADER_HEIGHT = 100;

  const getMonthFromOffset = (() => {
    const cache = new Map<number, Date>();
    return (offset: number) => {
      if (!cache.has(offset)) {
        cache.set(offset, addMonths(startOfMonth(new Date()), offset));
      }
      return cache.get(offset)!;
    };
  })();

  const months = useMemo(() => {
    return Array.from({ length: endIndex - startIndex + 1 }, (_, i) => {
      const monthIndex = startIndex + i;
      return { offset: monthIndex };
    });
  }, [startIndex, endIndex]);

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
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        mergedDays = { ...mergedDays, ...data };
      });

      setSchedule(mergedDays);
      setFetchedSchedule(true);
      setIsCalendarReady(true);
    });

    return () => unsubscribe();
  }, [employeeId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canLoadMoreTop = { current: true }; // Only allow load once per top scroll
    const canLoadMoreBottom = { current: true }; // Optional: for bottom as well

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const adjustedScrollTop = scrollTop + HEADER_HEIGHT;

      // --- Load more at bottom ---
      if (
        adjustedScrollTop + clientHeight >= scrollHeight - MONTH_HEIGHT &&
        canLoadMoreBottom.current
      ) {
        canLoadMoreBottom.current = false;
        setEndIndex((prev) => prev + LOAD_MONTHS);
      }

      // Reset bottom flag when scrolling away from bottom
      if (adjustedScrollTop + clientHeight < scrollHeight - MONTH_HEIGHT * 2) {
        canLoadMoreBottom.current = true;
      }

      // --- Load more at top ---
      if (adjustedScrollTop <= MONTH_HEIGHT && canLoadMoreTop.current) {
        canLoadMoreTop.current = false;
        setStartIndex((prev) => {
          const newStart = prev - LOAD_MONTHS;

          // Wait until DOM updates before re-triggering scroll logic
          setTimeout(() => {
            if (containerRef.current) handleScroll();
          }, 0);

          return newStart;
        });
      }

      // Reset top flag when scrolling away from top
      if (adjustedScrollTop > MONTH_HEIGHT * 2) {
        canLoadMoreTop.current = true;
      }

      // --- Update current visible month ---
      const rects = Object.entries(monthRefs.current)
        .map(([offset, el]) =>
          el && containerRef.current
            ? {
                offset: parseInt(offset),
                distance:
                  el.offsetTop -
                  containerRef.current.scrollTop -
                  HEADER_HEIGHT +
                  MONTH_CAPTION_HEIGHT,
              }
            : null
        )
        .filter(Boolean)
        .filter((item) => item!.distance <= 0)
        .sort((a, b) => b!.distance - a!.distance);

      const closest = rects[0];
      if (closest && closest.offset !== lastLoggedMonth.current) {
        lastLoggedMonth.current = closest.offset;
        const visibleMonth = getMonthFromOffset(closest.offset);
        setCurrentMonth(visibleMonth);
      }
    };

    const debouncedScroll = debounce(handleScroll, 50);
    container.addEventListener("scroll", debouncedScroll);
    return () => container.removeEventListener("scroll", debouncedScroll);
  }, [startIndex, endIndex]);

  const scrollToToday = (smooth: boolean = true) => {
    const el = monthRefs.current[0];
    if (el && containerRef.current) {
      containerRef.current.scrollTo({
        top:
          el.offsetTop -
          containerRef.current.offsetTop -
          HEADER_HEIGHT +
          MONTH_CAPTION_HEIGHT +
          2, // TODO: Remove hard coding 2 pixel to scroll to below div border
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  useEffect(() => {
    if (isCalendarReady) scrollToToday(false);
  }, [isCalendarReady]);

  const LoadingScreen: React.FC = () => (
    <Center style={{ height: "100vh" }}>
      <Loader size="lg" color="teal" />
    </Center>
  );

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {loading || !fetchedSchedule ? <LoadingScreen /> : null}

      <div
        ref={containerRef}
        style={{
          height: "100%",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
          visibility: isCalendarReady ? "visible" : "hidden",
        }}
      >
        {/* HEADER COMPONENT */}
        <Stack
          h={HEADER_HEIGHT}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 9999,
            borderBottom: "1px solid #eaeaea",
            backgroundImage:
              "linear-gradient(to bottom, rgb(240, 240, 240), rgba(240, 240, 240, 0.5))",
            backdropFilter: "blur(2rem)",
            WebkitBackdropFilter: "blur(2rem)", // ios
            // boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            willChange: "transform", // ios
            transform: "translateZ(0)", //ios
          }}
        >
          <Group id="HeaderTop" p="xs" justify="space-between">
            {/* Left: Logo and Titles */}
            <Group gap="xs" w={isMobile ? 60 : 300}>
              <img src={logo} alt="Shiftori" style={{ height: 40 }} />
              {!isMobile && (
                <>
                  <Title order={1}>シフトリ</Title>
                  <Title order={2}>
                    <Text>SHIFTORI</Text>
                  </Title>
                </>
              )}
            </Group>

            {/* Center: Current Month */}
            <Box
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack align="center" gap={0}>
                <Title order={4} style={{ width: "6em", textAlign: "center" }}>
                  {currentMonth
                    ? currentMonth.toLocaleString("en", { month: "long" })
                    : ""}
                </Title>
                {currentMonth &&
                  currentMonth.getFullYear() !== new Date().getFullYear() && (
                    <Title
                      order={1}
                      size="1em"
                      style={{ width: "6em", textAlign: "center" }}
                    >
                      {currentMonth.toLocaleString("en", { year: "numeric" })}
                    </Title>
                  )}
              </Stack>
            </Box>

            {/* Right: Burger Menu */}
            <Group w={60} justify="flex-end">
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />
            </Group>
          </Group>
          <Group grow gap={0}>
            {DaysOfWeek.map((day, index) => (
              <Text size="xs" key={index} style={{ paddingLeft: PADDING_SM }}>
                {day}
              </Text>
            ))}
          </Group>
        </Stack>
        {/* END OF HEADER COMPONENT */}

        {months.map(({ offset }) => {
          const month = getMonthFromOffset(offset);
          return (
            <div key={offset}>
              <div
                ref={(el) => {
                  monthRefs.current[offset] = el;
                }}
                style={{ height: "1px" }}
              />
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
                selected={selected}
                onSelect={setSelected}
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

                    const daySchedule = schedule[fullDate] || {};

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
