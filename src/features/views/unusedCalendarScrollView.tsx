import { useEffect, useState, useRef } from "react";
import { Stack, Text } from "@mantine/core";
import { Calendar, DatesProvider } from "@mantine/dates";
import { db } from "@/firebaseConfig"; // Import your Firebase config
import { doc, getDoc } from "firebase/firestore";
import { motion, useMotionValue, animate } from "framer-motion";
import { useDrag } from "@use-gesture/react";

const MONTH_HEIGHT = 350; // Adjust to match Calendar height
const BUFFER = 3; // Number of months rendered around the center

export function CalendarScrollView() {
  const [schedule, setSchedule] = useState<
    Record<string, { am?: string; pm?: string }>
  >({});
  const [offset, setOffset] = useState(0); // Tracks month offset
  const y = useMotionValue(0);
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Drag handler with momentum using Framer Motion
  const bind = useDrag(
    ({ down, movement: [, my], velocity, direction: [, dy], last }) => {
      dragging.current = down;
      setIsDragging(down);
      y.set(my);

      if (last) {
        // Add momentum/flick on release
        animate(y, my + velocity[1] * dy * 300, {
          type: "spring",
          stiffness: 200,
          damping: 30,
        });
      }
    },
    { axis: "y" }
  );

  // Infinite scroll logic runs only when not dragging
  useEffect(() => {
    const unsubscribe = y.on("change", (currentY) => {
      if (!dragging.current) {
        const threshold = MONTH_HEIGHT * BUFFER;
        if (currentY > threshold) {
          setOffset((prev) => prev - BUFFER);
          y.set(currentY - MONTH_HEIGHT * BUFFER);
        } else if (currentY < -threshold) {
          setOffset((prev) => prev + BUFFER);
          y.set(currentY + MONTH_HEIGHT * BUFFER);
        }
      }
    });
    return () => unsubscribe();
  }, [y]);

  // Generate visible months based on offset
  const months = Array.from({ length: BUFFER * 2 + 1 }, (_, i) => {
    const relativeIndex = i - BUFFER;
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth() + offset + relativeIndex,
      1
    );
  });

  // Fetch schedule data from Firestore
  useEffect(() => {
    async function fetchSchedule() {
      const teacherId = "teacherId016";
      const companyId = "companyId02";

      console.log("Fetching schedule from Firestore...");

      // Generate date strings for March 2025 with padded day values
      const monthDates = Array.from(
        { length: 31 },
        (_, i) => `2025-03-${String(i + 1).padStart(2, "0")}`
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
          newSchedule[date] = docSnap.data() as { am?: string; pm?: string };
        }
      }

      console.log("Final schedule object:", newSchedule);
      setSchedule(newSchedule);
    }

    fetchSchedule();
  }, []);

  return (
    <div style={{ height: 400, overflow: "hidden" }}>
      <motion.div
        {...(bind() as any)}
        style={{
          y,
          touchAction: "none",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {months.map((month, index) => (
          <div key={index} style={{ height: MONTH_HEIGHT, marginBottom: 10 }}>
            <DatesProvider settings={{ consistentWeeks: true }}>
              <Calendar
                firstDayOfWeek={0}
                withCellSpacing={false}
                maxLevel="month"
                style={{
                  borderSpacing: "0",
                  height: "fit-content",
                }}
                styles={{
                  calendarHeader: {
                    minWidth: "100%",
                    margin: "0px", // remove empty space between calendar header and body
                  },
                  month: {
                    width: "100%",
                  },
                  monthTbody: {
                    borderStyle: "hidden", // removes outside border on table
                  },
                  levelsGroup: {
                    justifyContent: "center",
                    width: "100%",
                    border: "2px solid #eaeaea",
                    borderRadius: "var(--mantine-radius-lg)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                  },
                  monthCell: {
                    borderWidth: "1px",
                    border: "solid 1px #eaeaea",
                    lineHeight: "0",
                  },
                  day: {
                    height: "100%",
                    width: "100%",
                  },
                }}
                renderDay={(date) => {
                  const year = date.getFullYear();
                  const monthStr = String(date.getMonth() + 1).padStart(2, "0");
                  const dayFormatted = String(date.getDate()).padStart(2, "0");
                  const formattedDate = `${year}-${monthStr}-${dayFormatted}`;
                  const daySchedule = schedule[formattedDate] || {};

                  return (
                    <Stack align="center" h={"4.5rem"} gap={"0"}>
                      <Text size="xs">{date.getDate()}</Text>
                      <Text
                        c={daySchedule.am === "Office" ? "gray" : "cyan"}
                        inline
                        size="xs"
                        m={"xs"}
                      >
                        {daySchedule.am || ""}
                      </Text>
                      <Text
                        c={daySchedule.pm === "Office" ? "gray" : "green"}
                        inline
                        size="xs"
                      >
                        {daySchedule.pm || ""}
                      </Text>
                    </Stack>
                  );
                }}
              />
            </DatesProvider>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
