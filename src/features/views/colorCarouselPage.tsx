import { Carousel } from "@mantine/carousel";
import { Box } from "@mantine/core";

export default function ColorCarouselPage() {
  const slidesContent = Array.from({ length: 30 }, (_, i) => {
    const colors = [
      "red.2",
      "blue.2",
      "green.2",
      "yellow.2",
      "orange.2",
      "cyan.2",
      "grape.2",
      "teal.2",
      "lime.2",
      "indigo.2",
    ];
    const heights = [100, 250, 150, 180, 220, 130, 170, 210, 140, 200];
    return (
      <Box
        key={i}
        bg={colors[i % colors.length]}
        p="md"
        style={{ height: heights[i % heights.length] }}
      >
        Slide {i + 1}
      </Box>
    );
  });

  return (
    <Box style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <Carousel
        orientation="vertical"
        slideSize="auto"
        slideGap="sm"
        align="start"
        withControls
        height="100%"
        styles={{
          container: { height: "100%" },
        }}
      >
        {slidesContent.map((slide, index) => (
          <Carousel.Slide key={index}>{slide}</Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
