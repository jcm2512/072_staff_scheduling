import {
  Icon,
  Button,
  Text,
  Image,
  HStack,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverContent,
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";

import { logOut } from "@/auth/authService";

function UserAvatar({ user }) {
  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };
  return (
    <>
      <Image
        borderRadius="full"
        boxSize="40px"
        src={user.photoURL}
        alt="User Profile"
      />
      <VStack spacing={0} align="start" flex={1}>
        <Text fontSize="lg" fontWeight="bold">
          {user.displayName}
        </Text>
        <Text fontSize="sm" fontWeight="light">
          ELC, North Division
        </Text>
      </VStack>
      <Popover>
        <PopoverTrigger>
          <Button
            w="40px"
            h="40px"
            p={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <HiMenu size="80%" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Account Info</PopoverHeader>
          <PopoverBody>
            <Button colorScheme="red" size="lg" onClick={handleLogout}>
              Logout
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default UserAvatar;
