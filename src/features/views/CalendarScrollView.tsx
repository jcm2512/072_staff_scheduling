import { Carousel } from "@mantine/carousel";
import { useEffect, useRef, useState } from "react";
import { DatesProvider } from "@mantine/dates";
import { em, Loader, Center, Box } from "@mantine/core";
import { db } from "@/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { CalendarComponent } from "@/features/components/CalendarComponent";
import { useMediaQuery } from "@mantine/hooks";
import { useEmployeeId } from "@/hooks/useEmployeeId";
import { Calendar } from "@mantine/dates";

type CalendarSwipeViewProps = {
  isMobile?: boolean;
  initialMonth?: number;
  numberOfMonths?: number;
  defaultYear?: number;
  onMonthChange?: (date: Date) => void;
};

type DaySchedule = {
  am?: string;
  pm?: string;
  allday?: boolean;
  irregular?: boolean;
};

function getCurrentYearAndMonth() {
  const now = new Date();
  return { currentYear: now.getFullYear(), currentMonth: now.getMonth() };
}

const { currentYear, currentMonth } = getCurrentYearAndMonth();

export function CalendarScrollView({
  defaultYear = currentYear,
  initialMonth = 2,
  numberOfMonths = 13,
  isMobile,
  onMonthChange,
}: CalendarSwipeViewProps) {
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const { employeeId, loading } = useEmployeeId();

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
    });

    return () => unsubscribe();
  }, [employeeId]);

  const initialSlide =
    currentYear === defaultYear
      ? currentMonth - initialMonth
      : currentYear === defaultYear + 1
      ? 12 - initialMonth + currentMonth
      : 0;

  const slideNumbers = Array.from(
    { length: numberOfMonths },
    (_, i) => initialMonth + i
  );

  useEffect(() => {
    if (onMonthChange) {
      const rawMonth = slideNumbers[initialSlide];
      const date = new Date(defaultYear, rawMonth);
      onMonthChange(date);
    }
  }, []);

  const manualSlides = slideNumbers.map((index) => (
    <Carousel.Slide key={index}>
      <CalendarComponent
        schedule={schedule}
        date={new Date(currentYear, index)}
        swipe={true}
        isMobile={isMobile ?? false}
      />
    </Carousel.Slide>
  ));

  if (loading)
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" color="teal" />
      </Center>
    );

  return (
    <DatesProvider settings={{ consistentWeeks: true }}>
      <Box
        style={{
          height: "100%",
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Calendar
          firstDayOfWeek={0}
          withCellSpacing={false}
          maxLevel="month"
          styles={{
            calendarHeaderControl: {
              display: "none", // removes controls to switch months (use carousel instead)
            },
            calendarHeader: {
              display: "none", // try to hide header so month cells can fill entire slide
            },
            month: {
              width: "100%", // month fills entire width of slide
            },
            monthTbody: {
              display: "none",
            },
            day: {
              display: "none",
            },
          }}
        />
        <Carousel
          dragFree
          initialSlide={initialSlide}
          orientation="vertical"
          slideSize="auto"
          slideGap="0"
          align="start"
          height="100%"
          onSlideChange={(index) => {
            const rawMonth = slideNumbers[index];
            const date = new Date(defaultYear, rawMonth);
            onMonthChange?.(date); // 👈 pass back to parent
          }}
          nextControlProps={{
            style: {
              position: "absolute",
              top: 0,
              right: "2em",
              zIndex: 9000,
            },
          }}
          previousControlProps={{
            style: {
              position: "absolute",
              top: 0,
              right: "5em",
              zIndex: 9000,
            },
          }}
          styles={{
            controls: {
              // top: 0,
              // bottom: "auto",
              // position: "absolute",
              // width: "100%",
              // justifyContent: "space-between",
              // padding: "0 8px", // optional padding
              right: 0,
            },
          }}
        >
          {manualSlides}
        </Carousel>
      </Box>
    </DatesProvider>
  );
}
