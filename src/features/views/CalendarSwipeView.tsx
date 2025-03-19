import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";
import { DatesProvider } from "@mantine/dates";
import { db } from "@/firebaseConfig"; // Your Firebase config
import { collection, onSnapshot } from "firebase/firestore";
import { CalendarComponent } from "@/features/components/CalendarComponent";

type CalendarSwipeViewProps = {
  initialMonth?: number; // The starting month index (0-indexed)
  numberOfMonths?: number; // How many months to display
  defaultYear?: number; // The scheduling year start (e.g. 2023 if schedules run April 2023 - March 2024)
};

type DaySchedule = {
  am?: string;
  pm?: string;
  allday?: boolean;
  irregular?: boolean;
};

function getCurrentYearAndMonth(): {
  currentYear: number;
  currentMonth: number;
} {
  const now = new Date();
  return { currentYear: now.getFullYear(), currentMonth: now.getMonth() };
}

const { currentYear, currentMonth } = getCurrentYearAndMonth();

export function CalendarSwipeView({
  defaultYear = currentYear,
  initialMonth = 2, // 0-index based, so March = 2
  numberOfMonths = 13,
}: CalendarSwipeViewProps) {
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});

  useEffect(() => {
    const teacherId = "teacherId016";
    const companyId = "companyId02";

    const scheduleCollectionRef = collection(
      db,
      "companies",
      companyId,
      "teacher",
      teacherId,
      "monthlySchedule"
    );

    console.log("Fetching schedule from Firestore...");

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
      console.log(mergedDays);
    });

    return () => unsubscribe();
  }, []);

  //   Calculate the initial slide index to center on the current month
  const initialSlide =
    currentYear === defaultYear
      ? currentMonth - initialMonth
      : currentYear === defaultYear + 1
      ? 12 - initialMonth + currentMonth
      : 0;

  //   const slideNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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
      />
    </Carousel.Slide>
  ));

  return (
    <DatesProvider settings={{ consistentWeeks: true }}>
      <Carousel
        initialSlide={initialSlide}
        slideSize="fit-content"
        align="center"
        loop={false}
        // onSlideChange={setCurrentSlide}
        // withControls={false}
        controlsOffset="1vw"
        height={"fit-content"}
        controlSize={30}
        includeGapInSize={false}
        skipSnaps={true}
        slideGap={"xs"}
        style={{
          width: "100vw",
        }}
      >
        {manualSlides}
      </Carousel>
    </DatesProvider>
  );
}
