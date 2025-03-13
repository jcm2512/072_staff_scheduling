import "@mantine/core/styles.css";

import { Group, UnstyledButton } from "@mantine/core";
import classes from "@/styles/MobileNavbar.module.css";
import { AvatarPopover } from "@/components/popover";
import { SignOut } from "./signOut";

export function NavItems() {
  return (
    <>
      <UnstyledButton className={classes.control}>NavItem</UnstyledButton>
      {/* <AvatarPopover color="primary" /> */}
      <SignOut />
    </>
  );
}
