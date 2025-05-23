import { createTheme, virtualColor, colorsTuple } from "@mantine/core";

export const theme = createTheme({
  colors: {
    "robbin-egg-blue": colorsTuple([
      "#e2fefc",
      "#d3f6f4",
      "#aeeae6",
      "#84ddd7",
      "#62d3cb",
      "#4bccc3",
      "#3bc9bf",
      "#27b2a8",
      "#139e96",
      "#008982",
    ]),
    "midnight-green": colorsTuple([
      "#eff9fb",
      "#e1eff2",
      "#bddfe5",
      "#96cfd8",
      "#78c1cd",
      "#65b8c6",
      "#5ab4c4",
      "#4a9ead",
      "#3c8d9a",
      "#267a87",
    ]),
    "anti-flash-white": colorsTuple([
      "#f3f6f7",
      "#eaeaea",
      "#cfd3d3",
      "#b0bcbc",
      "#97a8a8",
      "#869c9c",
      "#7c9696",
      "#698282",
      "#5b7474",
      "#486565",
    ]),
    "light-red": colorsTuple([
      "#ffe7e8",
      "#ffcece",
      "#ff9b9b",
      "#ff6464",
      "#fe3736",
      "#fe1b19",
      "#ff0909",
      "#e40000",
      "#cb0000",
      "#b20000",
    ]),
    "naples-yellow": colorsTuple([
      "#fffce1",
      "#fff7cb",
      "#ffee9a",
      "#ffe564",
      "#ffdd38",
      "#ffd71c",
      "#ffd509",
      "#e3bc00",
      "#caa700",
      "#ae9000",
    ]),
    primary: virtualColor({
      name: "primary",
      dark: "pink",
      light: "robbin-egg-blue",
    }),
    secondary: virtualColor({
      name: "secondary",
      dark: "pink",
      light: "midnight-green",
    }),
    background: virtualColor({
      name: "background",
      dark: "pink",
      light: "anti-flash-white",
    }),
    accent: virtualColor({
      name: "accent",
      dark: "pink",
      light: "light-red",
    }),
    highlight: virtualColor({
      name: "highlight",
      dark: "pink",
      light: "naples-yellow",
    }),
  },
});
