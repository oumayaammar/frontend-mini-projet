import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CardImage } from "./Card";

export function CarouselSize() {
  return (
    <Carousel opts={{ align: "start" }} className="w-full px-5 py-7">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="basis-full sm:basis-1/2 lg:basis-1/2"
          >
            <div className="p-1">
              <CardImage />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious  className="left-0 "/>
      <CarouselNext  className="right-0 "/>
    </Carousel>
  );
}