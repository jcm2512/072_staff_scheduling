import { useState, useMemo, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { addMonths, startOfMonth, format } from "date-fns";
import "react-day-picker/dist/style.css";

const MONTH_HEIGHT = 360;
const INITIAL_RANGE = 12;

export default function Rdp() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<Date[] | undefined>([]);
  const [startIndex, setStartIndex] = useState(-6); // 6 months before today
  const [endIndex, setEndIndex] = useState(18); // 18 months after

  const lastLoggedMonth = useRef<number | null>(null);
  const monthRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [currentMonthLabel, setCurrentMonthLabel] = useState<string>("");

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

  // Scroll logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      // Lazy Load Future Months
      if (scrollTop + clientHeight >= scrollHeight - MONTH_HEIGHT) {
        setEndIndex((prev) => prev + 6);
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

        setStartIndex((prev) => prev - 6);

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

      // Update current visible month (for sticky header)
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
        setCurrentMonthLabel(format(visibleMonth, "MMMM yyyy"));
        lastLoggedMonth.current = closest.offset;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [startIndex, endIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToToday(false); // instant scroll on mount
      });
    });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Sticky Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "white",
          zIndex: 10,
          padding: "0.5rem 1rem",
          borderBottom: "1px solid #ddd",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        {currentMonthLabel || "Loading..."}
        <button
          onClick={scrollToToday}
          style={{
            float: "right",
            fontSize: "0.9rem",
            padding: "0.3rem 0.6rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Today
        </button>
      </div>

      {/* Scrollable Calendar */}
      <div
        ref={containerRef}
        style={{
          height: "80vh",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "1rem",
        }}
      >
        {months.map((offset) => {
          const month = addMonths(startOfMonth(new Date()), offset);
          return (
            <div
              key={offset}
              ref={(el) => {
                monthRefs.current[offset] = el;
              }}
              style={{ marginBottom: "2rem" }}
            >
              <DayPicker
                mode="multiple"
                required={false}
                month={month}
                selected={selected}
                onSelect={setSelected}
                showOutsideDays
                disableNavigation
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
