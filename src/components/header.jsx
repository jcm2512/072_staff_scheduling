import "@mantine/core/styles.css";

import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Title,
  Text,
} from "@mantine/core";
import classes from "@/styles/MobileNavbar.module.css";
import logo from "@/assets/shiftori_logo.png";
import { AvatarPopover } from "./popover";
import { NavItems } from "./NavItems";

export function Header(props) {
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <Burger
          opened={props.opened}
          onClick={props.toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <Group
          justify="space-between"
          style={{
            flex: 1,
          }}
        >
          <Group gap="xs">
            <img
              src={logo}
              alt="Shiftori"
              style={{
                height: 40,
              }}
            />

            <Title order={1}>シフトリ</Title>
            <Title order={2}>
              <Text>SHIFTORI</Text>
            </Title>
          </Group>

          <Group ml="xl" gap={0} visibleFrom="sm">
            <NavItems />
          </Group>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
