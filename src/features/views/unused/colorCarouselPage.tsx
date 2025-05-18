import { Carousel } from "@mantine/carousel";
import { Box } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

export function ColorCarouselPage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const emblaRef =
    useRef<ReturnType<(typeof Carousel)["prototype"]["getEmbla"]>>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      if (!isHovered || !emblaRef.current) return;

      if (Math.abs(e.deltaY) < 10) return;
      e.preventDefault();

      if (e.deltaY > 0) {
        emblaRef.current.scrollNext();
      } else {
        emblaRef.current.scrollPrev();
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleGlobalWheel);
  }, [isHovered]);

  const slides = Array.from({ length: 20 }, (_, i) => (
    <Carousel.Slide key={i}>
      <Box
        bg={`${["red", "blue", "green", "orange", "grape"][i % 5]}.4`}
        style={{
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        Slide {i + 1}
      </Box>
    </Carousel.Slide>
  ));

  return (
    <Box
      ref={carouselRef}
      style={{ height: "100vh", overflow: "hidden" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel
        orientation="vertical"
        slideSize="auto"
        slideGap="sm"
        align="start"
        withControls
        height="100%"
        dragFree
        getEmblaApi={(api) => {
          emblaRef.current = api;
        }}
      >
        {slides}
      </Carousel>
    </Box>
  );
}
