import { Divider, Group, Pill, Stack, Text } from "@mantine/core";

export default function DayDrawerComponent() {
  return (
    <>
      <Divider label="am" labelPosition="center"></Divider>
      <Stack
        gap={"0.3rem"}
        style={{
          borderLeft: "1px solid var(--mantine-color-highlight-5)",
          borderRight: "1px solid var(--mantine-color-highlight-5)",
          borderBottom: "1px solid var(--mantine-color-highlight-5)",
          borderTop: "5px solid var(--mantine-color-highlight-5)",
          borderRadius: "0.5rem",
        }}
        p={"xs"}
      >
        <Group mb={"1rem"}>
          <Stack
            flex={1}
            align="left"
            gap={1}
            style={{ borderRadius: "0.5rem", overflow: "hidden" }}
          >
            <Text style={{ fontWeight: 900 }}>Seika </Text>
            <Text size="sm">Momonosato Kindergarten</Text>
            <Text size="sm" fw={600} w={"fit-content"}>
              Hanaten @ 9:40
            </Text>
          </Stack>
          <Stack gap={"xs"} style={{ alignItems: "end" }}>
            <Text size="2.5rem" style={{ fontWeight: 700 }}>
              MO
            </Text>
            <Pill>Haruka</Pill>
          </Stack>
        </Group>
        <Group>
          <Text flex={1}>K2</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              10:00
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              10:20
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}></Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>K2</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              10:20
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              10:40
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}></Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>K2</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              10:40
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              11:00
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}></Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>K3</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              11:00
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              11:20
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}></Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>K3</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              11:20
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              11:40
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}></Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>K3</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              11:40
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              12:00
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}></Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>K3</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              12:20
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              12:40
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}></Text>
        </Group>
      </Stack>
      {/* //////////////////////////////////////////////////////////////////// */}
      <Divider label="pm" labelPosition="center"></Divider>
      {/* //////////////////////////////////////////////////////////////////// */}

      <Stack
        gap={"0.25rem"}
        style={{
          borderLeft: "1px solid var(--mantine-color-secondary-3)",
          borderRight: "1px solid var(--mantine-color-secondary-3)",
          borderBottom: "1px solid var(--mantine-color-secondary-3)",
          borderTop: "5px solid var(--mantine-color-secondary-3)",
          borderRadius: "0.5rem",
        }}
        p={"xs"}
      >
        <Group mb={"1rem"}>
          <Stack
            flex={5}
            align="left"
            gap={1}
            style={{ borderRadius: "0.5rem", overflow: "hidden" }}
          >
            <Text style={{ fontWeight: 900 }}>Kagai </Text>
            <Text size="sm">Momonosato Kindergarten</Text>
            <Text size="sm" fw={600} w={"fit-content"}>
              Hanaten @ 13:35
            </Text>{" "}
          </Stack>
          <Stack gap={"xs"} style={{ alignItems: "end" }}>
            <Text size="2.5rem" style={{ fontWeight: 700 }}>
              MO
            </Text>
            <Pill>Haruka</Pill>
          </Stack>
        </Group>
        <Group>
          <Text flex={1}>K1 / K2</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              14:10
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              15:00
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}>
            4 students
          </Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>K3</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              15:10
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              16:00
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}>
            7 students
          </Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>E1</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              16:20
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              17:10
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}>
            8 students
          </Text>
        </Group>
        <Divider></Divider>
        <Group>
          <Text flex={1}>E2</Text>
          <Group>
            <Text flex={2} style={{ textAlign: "right" }}>
              17:10
            </Text>
            <Text flex={1} style={{ textAlign: "center" }}>
              -
            </Text>
            <Text flex={2} style={{ textAlign: "left" }}>
              18:00
            </Text>
          </Group>
          <Text flex={1} size="xs" style={{ textAlign: "right" }}>
            6 students
          </Text>
        </Group>
      </Stack>
      <Group my={"4rem"}></Group>
    </>
  );
}
