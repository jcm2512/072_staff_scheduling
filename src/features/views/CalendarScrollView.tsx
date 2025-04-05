import { Carousel } from "@mantine/carousel";
import { useEffect, useRef, useState } from "react";
import { DatesProvider } from "@mantine/dates";
import { em, Loader, Center } from "@mantine/core";
import { db } from "@/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { CalendarComponent } from "@/features/components/CalendarComponent";
import { useMediaQuery } from "@mantine/hooks";
import { useEmployeeId } from "@/hooks/useEmployeeId";

type CalendarSwipeViewProps = {
  initialMonth?: number;
  numberOfMonths?: number;
  defaultYear?: number;
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
}: CalendarSwipeViewProps) {
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);
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

  const manualSlides = slideNumbers.map((index) => (
    <Carousel.Slide key={index} style={{ height: "100%", paddingTop: "3vh" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CalendarComponent
          schedule={schedule}
          date={new Date(currentYear, index)}
          swipe={true}
        />
      </div>
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
      <Carousel
        initialSlide={initialSlide}
        orientation="vertical"
        align="start"
        loop={false}
        // withControls={false}
        height="calc(100vh - var(--app-shell-header-offset, 0rem) - (2 * var(--app-shell-padding)))"
        // slideSize="calc(100vh - var(--app-shell-header-offset, 0rem) - (2 * var(--app-shell-padding)))"
        includeGapInSize={false}
        skipSnaps={true}
      >
        {manualSlides}
      </Carousel>
    </DatesProvider>
  );
}
