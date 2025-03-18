import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";
import { DatesProvider } from "@mantine/dates";
import { db } from "@/firebaseConfig"; // Import your Firebase config
import { doc, getDoc } from "firebase/firestore";
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
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // zero-based month (January is 0)
  return { currentYear, currentMonth };
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

  const shouldRenderFullCalendar = (index: number) => {
    return Math.abs(index - currentSlide) <= 1;
  };

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

  useEffect(() => {
    async function fetchSchedule() {
      const teacherId = "teacherId016";
      const companyId = "companyId02";

      console.log("Fetching schedule from Firestore...");

      // Instead of hardcoding a month (e.g., March 2025), define dynamic values:
      const scheduleYear = 2025;
      const scheduleMonth = 2; // 0-indexed: 2 represents March

      // Dynamically calculate the number of days in the month:
      const daysInMonth = new Date(
        scheduleYear,
        scheduleMonth + 1,
        0
      ).getDate();

      // Generate an array of date strings for the entire month
      const monthDates = Array.from(
        { length: daysInMonth },
        (_, i) =>
          `${scheduleYear}-${String(scheduleMonth + 1).padStart(
            2,
            "0"
          )}-${String(i + 1).padStart(2, "0")}`
      );

      const newSchedule: Record<string, { am?: string; pm?: string }> = {};

      for (const date of monthDates) {
        const docRef = doc(
          db,
          "companies",
          companyId,
          "teacher",
          teacherId,
          "schedule",
          date
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          newSchedule[date] = docSnap.data();
        }
      }

      console.log("Final schedule object:", newSchedule);
      setSchedule(newSchedule);
    }

    fetchSchedule();
  }, []);

  // Calculate relative slide index when the scheduling year is the current year or the next
  const initialSlide =
    currentYear === defaultYear
      ? currentMonth - initialMonth
      : currentYear === defaultYear + 1
      ? 12 - initialMonth + currentMonth
      : 0;

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
