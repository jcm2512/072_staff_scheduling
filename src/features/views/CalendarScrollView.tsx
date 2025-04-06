import { Carousel } from "@mantine/carousel";
import { useEffect, useRef, useState } from "react";
import { DatesProvider } from "@mantine/dates";
import { em, Loader, Center, Box } from "@mantine/core";
import { db } from "@/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { CalendarComponent } from "@/features/components/CalendarComponent";
import { useMediaQuery } from "@mantine/hooks";
import { useEmployeeId } from "@/hooks/useEmployeeId";

type CalendarSwipeViewProps = {
  isMobile?: boolean;
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
  isMobile,
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
      <Box style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Carousel
          // dragFree
          // initialSlide={initialSlide}
          initialSlide={0}
          orientation="vertical"
          align="start"
          loop={false}
          withControls={isMobile ? true : true}
          height="100%" // height of the viewer
          h={"100%"} // height of each slide
          w={"100%"}
          // includeGapInSize={false}
          // skipSnaps={true}
        >
          {manualSlides}
        </Carousel>
      </Box>
    </DatesProvider>
  );
}
