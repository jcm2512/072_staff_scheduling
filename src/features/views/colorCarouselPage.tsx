import { Carousel } from "@mantine/carousel";
import { Box } from "@mantine/core";

const slides = [
  { color: "red" },
  { color: "blue" },
  { color: "green" },
  { color: "purplewwwwwwwwwwwww" },
  { color: "orange" },
];

export default function ColorCarouselPage() {
  return (
    <Carousel
      withIndicators
      height="100%"
      loop
      orientation="vertical"
      w={"100%"}
    >
      {slides.map((slide, index) => (
        <Carousel.Slide key={index}>
          <Box
            h="100%" // Ensure it fills the carousel slide
            w="100%"
            style={{
              backgroundColor: slide.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {slide.color.toUpperCase()}
          </Box>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
