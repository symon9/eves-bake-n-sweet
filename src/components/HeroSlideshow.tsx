"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

interface HeroSlideshowProps {
  images: { src: string; alt: string }[];
  onChange?: (index: number) => void;
}

const HeroSlideshow = ({ images, onChange }: HeroSlideshowProps) => {
  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      showArrows={false}
      showIndicators={true}
      infiniteLoop={true}
      autoPlay={true}
      interval={5000}
      transitionTime={1000}
      className="h-full w-full"
      onChange={onChange}
    >
      {images.map((image, index) => (
        <div key={index} className="relative h-[80vh]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default HeroSlideshow;
