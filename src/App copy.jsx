// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  StackDivider,
  Flex,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";
import Home from "./components/home";
import Signin from "./components/signin";
import UserAvatar from "./components/userAvatar";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Box minW="100vw" minH="100vh" bg="gray.100">
      {/* Top Navigation Bar */}
      <Box bg="white" color="blue.600" py={1} px={2} boxShadow="md">
        <Flex
          align="center"
          justify="space-between"
          maxW="container.xl"
          mx="auto"
          px={4}
        >
          <Box>
            <Heading as="h1" size="lg">
              シフトリ
            </Heading>
            <Heading as="h3" size="sm" color="blue.300">
              SHIFTLY
            </Heading>
          </Box>
          <HStack h="40px">
            {user && <UserAvatar {...{ user, setUser }} />}
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Flex align="center" justify="center" minH="calc(100vh - 80px)">
        <Box
        // width="100%"
        // maxW="container.md"
        // bg="white"
        // boxShadow="md"
        // borderRadius="md"
        // p={8}
        >
          <VStack align="center">
            <StackDivider borderColor="gray.200" />
            {user ? (
              <Home {...{ user, setUser }} />
            ) : (
              <Signin {...{ setUser }} />
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default App;
