// Rdp.tsx
import logo from "@/assets/shiftori_logo.png";

// React and libraries
import { useRef, useMemo } from "react";
import { Stack, Text, Title, Group, Box, Burger } from "@mantine/core";
import { DayPicker } from "react-day-picker";
import { addMonths, startOfMonth } from "date-fns";

import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

import { ListRowRenderer } from "react-virtualized";

// App-specific imports

// utils

// Styles
import "react-day-picker/dist/style.css";

// Hooks
import { useMediaQuery } from "@mantine/hooks";

// Constants

const getMonthFromOffset = (offset: number) =>
  addMonths(startOfMonth(new Date()), offset);

const TOTAL_MONTHS = 12;

export default function Virtualized() {
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const HEADER_HEIGHT = 100;

  const months = useMemo(
    () => Array.from({ length: TOTAL_MONTHS }, (_, i) => i),
    []
  );

  // Cache to dynamically measure height
  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 360,
      fixedWidth: true,
    })
  ).current;

  const rowRenderer: ListRowRenderer = ({ index, key, style, parent }) => {
    const month = getMonthFromOffset(index);

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        rowIndex={index}
        key={key}
        parent={parent}
      >
        <div style={style}>
          <DayPicker month={month} captionLayout="dropdown" showOutsideDays />
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // ✅ prevent outer scrollbars
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

            {/* Center: Title */}
            <Box
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Title
            </Box>

            {/* Right: Burger Menu */}
            <Group w={60} justify="flex-end">
              <Burger hiddenFrom="sm" size="sm" />
            </Group>
          </Group>
        </Stack>
        {/* END OF HEADER COMPONENT */}

        <div id="body" style={{ flex: 1, overflow: "hidden" }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={months.length}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                overscanRowCount={2}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
}
