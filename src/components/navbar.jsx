import "@mantine/core/styles.css";
import classes from "@/styles/MobileNavbar.module.css";

import { AppShell, UnstyledButton, Button } from "@mantine/core";
import { AvatarPopover } from "@/components/popover";
import { NavItems } from "./NavItems";

export function Navbar() {
  return (
    <AppShell.Navbar py="md" px={4}>
      <NavItems />
    </AppShell.Navbar>
  );
}
