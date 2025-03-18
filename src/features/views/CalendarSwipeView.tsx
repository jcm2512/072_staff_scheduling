import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";
import { DatesProvider } from "@mantine/dates";
import { db } from "@/firebaseConfig"; // Your Firebase config
import { collection, getDocs } from "firebase/firestore";
import { CalendarComponent } from "@/components/Calendar";

type CalendarSwipeViewProps = {
  initialMonth?: number; // The starting month index (0-indexed)
  numberOfMonths?: number; // How many months to display
  defaultYear?: number; // The scheduling year start (e.g. 2023 if schedules run April 2023 - March 2024)
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
  initialMonth = 2,
  numberOfMonths = 13,
}: CalendarSwipeViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [schedule, setSchedule] = useState<
    Record<string, { am?: string; pm?: string }>
  >({});

  // Helper to figure out which month/year a given slide index corresponds to
  const getMonthDate = (slideIndex: number) => {
    let month: number;
    let year: number;

    if (slideIndex < 9) {
      month = initialMonth + slideIndex;
      year = defaultYear;
    } else {
      month = slideIndex - 9;
      year = defaultYear + 1;
    }
    return new Date(year, month, 1);
  };

  // Only render the full calendar for slides close to the current slide (for performance)
  const shouldRenderFullCalendar = (index: number) => {
    return Math.abs(index - currentSlide) <= 1;
  };

  useEffect(() => {
    async function fetchSchedule() {
      const teacherId = "teacherId016";
      const companyId = "companyId02";

      console.log("Fetching all schedule docs from Firestore...");

      // Query the entire 'schedule' subcollection (no date filtering)
      const scheduleCollectionRef = collection(
        db,
        "companies",
        companyId,
        "teacher",
        teacherId,
        "schedule"
      );

      const snapshot = await getDocs(scheduleCollectionRef);
      const newSchedule: Record<string, { am?: string; pm?: string }> = {};

      // Each doc.id is presumably the date (e.g. "2025-04-01")
      snapshot.forEach((doc) => {
        newSchedule[doc.id] = doc.data() as { am?: string; pm?: string };
      });

      console.log("Final schedule object:", newSchedule);
      setSchedule(newSchedule);
    }

    fetchSchedule();
  }, []);

  // Calculate the initial slide index to center on the current month
  const initialSlide =
    currentYear === defaultYear
      ? currentMonth + 1 - initialMonth
      : currentYear === defaultYear + 1
      ? 12 - initialMonth + (currentMonth + 1)
      : 0;

  // Build the carousel slides
  const slides = Array.from({ length: numberOfMonths }, (_, i) => {
    const defaultDate = getMonthDate(i);
    return (
      <Carousel.Slide key={i}>
        {shouldRenderFullCalendar(i) ? (
          <CalendarComponent schedule={schedule} defaultDate={defaultDate} />
        ) : (
          <div style={{ height: "100%" }} />
        )}
      </Carousel.Slide>
    );
  });

  return (
    <DatesProvider settings={{ consistentWeeks: true }}>
      <Carousel
        initialSlide={initialSlide}
        slideSize="100%"
        align="center"
        loop={false}
        withIndicators
        onSlideChange={setCurrentSlide}
      >
        {slides}
      </Carousel>
    </DatesProvider>
  );
}
