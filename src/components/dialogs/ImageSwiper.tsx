import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ImageSwiperProps {
  images: string[];
}

export function ImageSwiper({ images = [] }: ImageSwiperProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((imageUrl, index) => (
          <CarouselItem
            key={index}
            className="flex justify-center items-center"
          >
            <Image
              src={imageUrl}
              alt={`menu image ${index + 1}`}
              width={800}
              height={450}
              className="aspect-square w-full rounded-lg object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
