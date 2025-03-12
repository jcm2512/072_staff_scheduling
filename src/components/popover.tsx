import { Popover, Text, Button } from "@mantine/core";

interface AvatarPopoverProps {
  color: string; // Expects "primary", "secondary", "custom-name", etc
}
export function AvatarPopover({ color }: AvatarPopoverProps) {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button color={color} autoContrast>
          Toggle popover
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">
          This is uncontrolled popover, it is opened when button is clicked
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}
