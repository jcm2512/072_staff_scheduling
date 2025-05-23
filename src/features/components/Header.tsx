// Header.tsx
import logo from "@/assets/shiftori_logo.png";

import { Stack, Text, Title, Group, Box, Burger } from "@mantine/core";
import { useLayoutEffect, useRef } from "react";

import { useHeaderContext } from "@/context/HeaderContext";
import { zIndex } from "@/themes/zindex";

type VirtualizedProps = {
  PADDING?: any;
  TITLE_1?: string;
  TITLE_2?: string;
};

const DaysOfWeek = ["S", "M", "T", "W", "Th", "F", "S"];

export default function Header({
  PADDING = "0.3rem",
  TITLE_1 = "シフトリ",
  TITLE_2 = "SHIFTORI",
}: VirtualizedProps) {
  // Hooks
  const { setHeaderHeight, headerType, isMobile, contextualHeaderTitle } =
    useHeaderContext();
  const ref = useRef<HTMLDivElement | null>(null);

  // Side Effects
  useLayoutEffect(() => {
    if (!ref.current) return;

    const updateHeaderHeight = () =>
      setHeaderHeight(ref.current?.offsetHeight ?? 60);
    // console.log(headerHeight);

    const resizeObserver = new ResizeObserver(updateHeaderHeight);

    resizeObserver.observe(ref.current);
    updateHeaderHeight();

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Stack
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: zIndex.sticky,
        borderBottom: "1px solid #eaeaea",
        backgroundImage:
          "linear-gradient(to bottom, rgb(255, 255, 255), rgba(240, 240, 240, 0.4))",
        backdropFilter: "blur(0.5rem)",
        WebkitBackdropFilter: "blur(2rem)", // ios
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
              <Title order={1}>{TITLE_1}</Title>
              <Title order={2}>
                <Text>{TITLE_2}</Text>
              </Title>
            </>
          )}
        </Group>
        {/* --------------------- */}

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
          {contextualHeaderTitle}
        </Box>
        {/* --------------*/}

        {/* Right: Burger Menu */}
        <Group w={60} justify="flex-end">
          <Burger hiddenFrom="sm" size="sm" />
        </Group>
        {/* ------------------ */}
      </Group>
      {headerType === "calendar" && (
        <Group grow gap={0}>
          {DaysOfWeek.map((day, index) => (
            <Text size="xs" key={index} style={{ paddingLeft: PADDING }}>
              {day}
            </Text>
          ))}
        </Group>
      )}
    </Stack>
  );
}
