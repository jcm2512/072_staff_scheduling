import logo from "@/assets/shiftori_logo.png";

// Import styles of installed packages
import "@mantine/core/styles.css";

// Mantine components and hooks
import { Group, Title, Text, Burger, em, Box, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";

export function Header(currentMonth: any) {
  // Hooks
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(768)})`);

  return (
    <Group id="HeaderTop" p="xs" justify="space-between">
      {/* Left: Logo and Titles */}
      <Group gap="xs" w={isMobile ? 60 : 300}>
        <img src={logo} alt="Shiftori" style={{ height: 40 }} />
        {!isMobile && (
          <>
            <Title order={1}>シフトリ</Title>
            <Title order={2}>
              <Text>SHIFTORI2</Text>
            </Title>
          </>
        )}
      </Group>

      {/* Center: Current Month */}
      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack align="center" gap="0">
          <Title order={4} style={{ width: "6em", textAlign: "center" }}>
            {currentMonth
              ? currentMonth.toLocaleString("en", { month: "long" })
              : ""}
          </Title>
          {currentMonth &&
            currentMonth.getFullYear() !== new Date().getFullYear() && (
              <Title
                order={1}
                size="1em"
                style={{ width: "6em", textAlign: "center" }}
              >
                {currentMonth.toLocaleString("en", { year: "numeric" })}
              </Title>
            )}
        </Stack>
      </Box>

      {/* Right: Burger Menu */}
      <Group w={60} justify="flex-end">
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
        />
      </Group>
    </Group>
  );
}
