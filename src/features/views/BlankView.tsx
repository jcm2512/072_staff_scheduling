import { useHeaderContext } from "@/context/HeaderContext";
import { Stack, Text } from "@mantine/core";
import { useEffect } from "react";

import { HeaderType } from "@/context/HeaderContext";

type blackViewType = {
  title: string;
  headerType?: HeaderType;
};
export function BlankView({ title, headerType = "basic" }: blackViewType) {
  const { setHeaderType } = useHeaderContext();

  useEffect(() => {
    setHeaderType(headerType);
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
