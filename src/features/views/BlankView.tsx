import { useHeaderContext } from "@/context/HeaderContext";
import { Stack, Text } from "@mantine/core";
import { useEffect } from "react";

export function BlankView({ title }: { title: string }) {
  const { setHeaderType } = useHeaderContext();

  useEffect(() => {
    setHeaderType("calendar");
  }, []);
  return (
    <Stack
      h={"100vh"}
      w={"100%"}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <Text>{title}</Text>
    </Stack>
  );
}
