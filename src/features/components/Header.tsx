// Header.tsx
import { Stack, Text, Title, Group, Box, Burger } from "@mantine/core";

type VirtualizedProps = {
  isMobile: boolean | undefined;
  HEADER_HEIGHT: number;
  logo: string;
  TITLE_1?: string;
  TITLE_2?: string;
  CONTEXTUAL_TITLE?: string;
};

export default function Header({
  isMobile,
  HEADER_HEIGHT,
  logo,
  TITLE_1 = "シフトリ",
  TITLE_2 = "SHIFTORI",
  CONTEXTUAL_TITLE = "Title",
}: VirtualizedProps) {
  return (
    <Stack
      h={HEADER_HEIGHT}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        borderBottom: "1px solid #eaeaea",
        backgroundImage:
          "linear-gradient(to bottom, rgb(255, 255, 255), rgba(255, 255, 255, 0.1))",
        backdropFilter: "blur(1rem)",
        WebkitBackdropFilter: "blur(1rem)", // ios
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
          {CONTEXTUAL_TITLE}
        </Box>

        {/* Right: Burger Menu */}
        <Group w={60} justify="flex-end">
          <Burger hiddenFrom="sm" size="sm" />
        </Group>
      </Group>
    </Stack>
  );
}
