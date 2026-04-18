import CardList from "@/components/CardList";
import { CarouselSize } from "@/components/Carousel";
import { ChartPieDonutText } from "@/components/Chart";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";




export default function  AdminDashboard() {
  return (
    <div className=" flex  flex-nowrap gap-2 min-h-screen  p-1 rounded-2xl ">
      
        {/* LEFT SIDE */}
        <div className=" w-1/2 h-auto bg-primary-foreground pt-1.5 relative rounded-2xl">
          <Button  asChild variant="secondary" size="icon" className=" absolute top-2 right-0 z-50">
              <Link href="/news-managment"> <CirclePlus/>  </Link>
          </Button>
          <CarouselSize/>
        </div>
        {/* table time */}
        <div className=" w-1/4 h-auto bg-primary-foreground p-4 rounded-2xl">
          <CardList  />
        </div>
        {/* RIGHT SIDE */}
        <div  className=" w-1/3 h-auto bg-primary-foreground p-4 rounded-2xl">
          {/* <CalendarDemo/>   */}
          <ChartPieDonutText />
        </div>
        
      
    </div>
  );
}