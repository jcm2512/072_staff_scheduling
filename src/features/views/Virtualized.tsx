// Rdp.tsx
import logo from "@/assets/shiftori_logo.png";

// React and libraries
import { useRef } from "react";
import { Stack, Text, Title, Group, Box, Burger } from "@mantine/core";
import { DayPicker } from "react-day-picker";

// App-specific imports

// utils

// Styles
import "react-day-picker/dist/style.css";

// Hooks
import { useMediaQuery } from "@mantine/hooks";

// Constants

export default function Virtualized() {
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const HEADER_HEIGHT = 100;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        ref={containerRef}
        style={{
          height: "100%",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch",
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
      </div>
    </div>
  );
}
