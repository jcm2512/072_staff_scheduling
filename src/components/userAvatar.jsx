import {
  Avatar,
  Button,
  Text,
  Popover,
  Group,
  Stack,
  Menu,
} from "@mantine/core";
import { logOut } from "@/auth/authService";

function UserAvatar({ user, setUser }) {
  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  return (
    <Group spacing="sm">
      <Avatar src={user.photoURL} alt="User Profile" radius="xl" size="lg" />
      <Stack spacing={0} align="flex-start">
        <Text size="md" weight={700}>
          {user.displayName}
        </Text>
        <Text size="sm" color="dimmed">
          ELC, North Division
        </Text>
      </Stack>
      <Menu width={150} withArrow position="bottom-end">
        <Menu.Target>
          <Button variant="subtle" size="sm" p={0}>
            -
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item color="red" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

export default UserAvatar;
