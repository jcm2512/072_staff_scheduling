import { createSystem, defaultConfig } from "@chakra-ui/react";

export const light = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
    config: {
      initialColorMode: "light", // Ensures light mode
      useSystemColorMode: false, // Ignores system preferences
    },
  },
});

export const dark = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
    config: {
      initialColorMode: "dark", // Ensures dark mode
      useSystemColorMode: false, // Ignores system preferences
    },
  },
});
