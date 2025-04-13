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
  const [startIndex, setStartIndex] = useState(-6);
  const [endIndex, setEndIndex] = useState(18);
  const lastLoggedMonth = useRef<number | null>(null);
  const monthRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const { employeeId, loading } = useEmployeeId();
  const [fetchedSchedule, setFetchedSchedule] = useState(false);
  const [isCalendarReady, setIsCalendarReady] = useState(false);
  const HEADER_HEIGHT = 100;

  const months = useMemo(() => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return Array.from({ length: endIndex - startIndex + 1 }, (_, i) => {
      const monthIndex = startIndex + i;
      // Normalize negative monthIndex by adding 12 before applying modulo
      const normalizedIndex = ((monthIndex % 12) + 12) % 12;
      const monthName = monthNames[normalizedIndex]; // Now this will handle negative indices
      return { name: monthName, offset: monthIndex };
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

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      // Calculate the top of the current month considering the header height
      const adjustedScrollTop = scrollTop + HEADER_HEIGHT;

      // When the user has scrolled to the bottom, load more months
      if (adjustedScrollTop + clientHeight >= scrollHeight - MONTH_HEIGHT) {
        setEndIndex((prev) => prev + LOAD_MONTHS);
      }

      // When the user is at the top, load previous months
      if (adjustedScrollTop <= MONTH_HEIGHT) {
        setStartIndex((prev) => prev - LOAD_MONTHS);
      }

      // Calculate the distance of each month from the top, adjusted by HEADER_HEIGHT
      const rects = Object.entries(monthRefs.current)
        .map(([offset, el]) =>
          el
            ? {
                offset: parseInt(offset),
                distance:
                  el.getBoundingClientRect().top -
                  containerRef.current!.getBoundingClientRect().top -
                  HEADER_HEIGHT,
              }
            : null
        )
        .filter(Boolean)
        .filter((item) => item!.distance <= 0) // Only months that are above the top
        .sort((a, b) => b!.distance - a!.distance); // Sort by closest distance
      const closest = rects[0]; // Get the closest month

      if (closest && closest.offset !== startIndex) {
        const visibleMonth = addMonths(
          startOfMonth(new Date()),
          closest.offset
        );
        setCurrentMonth(visibleMonth);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [startIndex, endIndex]);

  const scrollToToday = (smooth: boolean = true) => {
    const el = monthRefs.current[0];
    if (el && containerRef.current) {
      containerRef.current.scrollTo({
        top: el.offsetTop - containerRef.current.offsetTop - HEADER_HEIGHT,
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
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(1rem)",
            WebkitBackdropFilter: "blur(1rem)",
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
              <Text key={index} style={{ paddingLeft: PADDING_SM }}>
                {day}
              </Text>
            ))}
          </Group>
        </Stack>
        {/* END OF HEADER COMPONENT */}

        {months.map(({ offset }) => {
          const month = addMonths(startOfMonth(new Date()), offset);
          return (
            <div key={offset}>
              <div
                id={`${months[month.getMonth()].name}_${offset}`}
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
                      <Title order={5} style={{ paddingLeft: PADDING_SM }}>
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
