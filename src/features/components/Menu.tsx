// Menu.tsx
import { Stack, Text, Title, Group, Box, Burger } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import {
  TbCalendar,
  TbCalendarFilled,
  TbSettings,
  TbSettingsFilled,
  TbLayoutList,
  TbLayoutListFilled,
} from "react-icons/tb";

import { useNavigate, useLocation } from "react-router-dom";

import { useLayoutEffect, useRef } from "react";
import { useMenuContext } from "@/context/MenuContext";

import { zIndex } from "@/themes/zindex";
export default function Menu() {
  const { setMenuHeight } = useMenuContext();

  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const ref = useRef<HTMLDivElement | null>(null);

  // Side Effects
  useLayoutEffect(() => {
    if (!ref.current) return;

    const updateMenuHeight = () =>
      setMenuHeight(ref.current?.offsetHeight ?? 60);

    const resizeObserver = new ResizeObserver(updateMenuHeight);

    resizeObserver.observe(ref.current);
    updateMenuHeight();

    return () => resizeObserver.disconnect();
  }, []);

  const iconStackStyle = {
    gap: 0,
    height: "5rem",
    justifyContent: "flex-start", // center horizontally
    alignItems: "center", // center vertically
    paddingBottom: "1rem",
  };

  const actionIconStyle = { variant: "subtle", size: "lg" };
  const iconTextStyle = {
    fontSize: "0.6rem",
    fontWeight: "bold",
    color: "grey",
  };
  const iconStyle = { width: "100%", height: "100%" };
  return (
    <>
      <Group
        grow
        ref={ref}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: zIndex.nav,
          borderTop: "1px solid #eaeaea",
          paddingTop: "0.5rem",
          backgroundImage:
            "linear-gradient(to top, rgb(255, 255, 255), rgb(245, 245, 245))",
          justifyContent: "center", // center horizontally
          alignItems: "start", // center vertically
          textAlign: "center",
        }}
      >
        <Stack style={iconStackStyle} onClick={() => navigate("/month")}>
          <ActionIcon
            {...{
              ...actionIconStyle,
              color: currentPath == "/month" ? "primary" : "grey",
              "aria-label": "Home",
            }}
          >
            {currentPath == "/month" ? (
              <TbCalendarFilled style={iconStyle} />
            ) : (
              <TbCalendar style={iconStyle} />
            )}
          </ActionIcon>
          <Text style={{ ...iconTextStyle }}>Month</Text>
        </Stack>
        <Stack style={iconStackStyle} onClick={() => navigate("/day")}>
          <ActionIcon
            {...{
              ...actionIconStyle,
              color: currentPath == "/day" ? "primary" : "grey",
              "aria-label": "Home",
            }}
          >
            {currentPath == "/day" ? (
              <TbCalendarFilled style={iconStyle} />
            ) : (
              <TbCalendar style={iconStyle} />
            )}
          </ActionIcon>
          <Text style={{ ...iconTextStyle }}>Day</Text>
        </Stack>

        <Stack style={iconStackStyle} onClick={() => navigate("/inbox")}>
          <ActionIcon
            {...{
              ...actionIconStyle,
              color: currentPath == "/inbox" ? "primary" : "grey",
              "aria-label": "Inbox",
            }}
          >
            {currentPath == "/inbox" ? (
              <TbLayoutListFilled style={iconStyle} />
            ) : (
              <TbLayoutList style={iconStyle} />
            )}
          </ActionIcon>
          <Text style={{ ...iconTextStyle }}>Inbox</Text>
        </Stack>
        <Stack style={iconStackStyle} onClick={() => navigate("/settings")}>
          <ActionIcon
            {...{
              ...actionIconStyle,
              color: currentPath == "/settings" ? "primary" : "grey",
              "aria-label": "Settings",
            }}
          >
            {currentPath == "/settings" ? (
              <TbSettingsFilled style={iconStyle} />
            ) : (
              <TbSettings style={iconStyle} />
            )}
          </ActionIcon>
          <Text
            style={{
              ...iconTextStyle,
            }}
          >
            Settings
          </Text>
        </Stack>
      </Group>
    </>
  );
}
