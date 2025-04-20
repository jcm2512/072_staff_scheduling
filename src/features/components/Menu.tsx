// Menu.tsx
import { Stack, Text, Title, Group, Box, Burger } from "@mantine/core";
import { useLayoutEffect, useRef } from "react";
import { useMenuContext } from "@/context/MenuContext";
export default function Menu() {
  const { setMenuHeight } = useMenuContext();

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
  return (
    <>
      <Group
        grow
        ref={ref}
        h={"5.5rem"}
        style={{
          padding: "1rem",
          borderTop: "1px solid #eaeaea",

          backgroundImage:
            "linear-gradient(to top, rgb(255, 255, 255), rgb(245, 245, 245))",
          justifyContent: "center", // center horizontally
          alignItems: "start", // center vertically
          textAlign: "center",
        }}
      >
        <Text>Menu</Text>
        <Text>Menu</Text>
        <Text>Menu</Text>
        <Text>Menu</Text>

        <Text>Menu</Text>
      </Group>
    </>
  );
}
