"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

interface ProductSlideshowProps {
  images: string[];
  altText: string;
}

const ProductSlideshow = ({ images, altText }: ProductSlideshowProps) => {
  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={5000}
      className="rounded-lg overflow-hidden"
    >
      {images.map((url, index) => (
        <div key={index} className="relative h-56 sm:h-80">
          <Image
            src={url}
            alt={`${altText} - image ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ProductSlideshow;
