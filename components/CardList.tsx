import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users2 , Sheet, FileSpreadsheet ,CirclePlus} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";  

const Content = [
  {
    id: 1,
    title: "Student",
    Icon: <Users2/>,
    count: 4300,
  },
  {
    id: 2,
    title: "Professor",
    Icon: <Users2/>,
    count: 3200,
  },
  {
    id: 3, 
    title: "Tables Times",
    Icon: <Sheet/>,
    count: 3200,
  },
   {
    id: 4, 
    title: "Courses",
    Icon: <FileSpreadsheet/>,
    count: 3200,
    },
  
];



const CardList = () => {

  return (
    <Carousel
      opts={{ align: "start" }}
      orientation="vertical"
      className="w-full max-w-xs"
    >
      {/* ↑ Previous — sits above the list, centered horizontally */}
      <CarouselPrevious
        className="
          static top-auto left-auto right-auto bottom-auto
          translate-x-0 translate-y-0
          mx-auto mb-2 flex
        "
      />

      <CarouselContent className="-mt-1 h-[270px]">
        {Content.map((item) => (
          <CarouselItem key={item.id} className="basis-1/2 pt-1">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center gap-3 py-3 px-4">
                  <span className="text-muted-foreground">{item.Icon}</span>
                  <CardTitle className="text-base font-medium">{item.title}</CardTitle>
                </CardContent>
                <CardFooter className="flex items-center justify-between py-2 px-4 border-t">
                  <span className="font-medium text-sm">{item.count}</span>
                  <CirclePlus className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-primary transition-colors" />
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* ↓ Next — sits below the list, centered horizontally */}
      <CarouselNext
        className="
          static top-auto left-auto right-auto bottom-auto
          translate-x-0 translate-y-0
          mx-auto mt-2 flex
        "
      />
    </Carousel>
  );
};

export default CardList;