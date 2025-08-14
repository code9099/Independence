import { IssueCardProps } from "@/components/IssueCard";
import { AlertTriangle, Droplets, Lightbulb, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

type IssuesCarouselRowProps = {
  title: string;
  items: IssueCardProps[];
  fullBleed?: boolean;
};

export default function IssuesCarouselRow({ title, items, fullBleed = false }: IssuesCarouselRowProps) {
  const loading = false; // hook into data state if needed
  return (
    <section aria-label={title} className={`${fullBleed ? "full-bleed" : ""} space-y-3`}>
      <h2 className="font-semibold text-2xl md:text-3xl text-gradient tracking-tight">
        {title}
      </h2>
      <div className="relative">
        <Carousel opts={{ align: "start" }} className="relative">
          <CarouselContent className="row-mask">
            {(loading ? Array.from({ length: 5 }).map((_, idx) => (
              <CarouselItem key={`s-${idx}`} className="basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="glass-panel p-4 min-h-[200px] rounded-xl">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-5/6" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-24 rounded" />
                    <Skeleton className="h-6 w-20 rounded ml-auto" />
                  </div>
                </div>
              </CarouselItem>
            )) : items.map((it, idx) => (
              <CarouselItem
                key={`${it.type}-${idx}`}
                className="basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <div className="group shine-on-hover glass-panel p-4 min-h-[200px] flex flex-col rounded-xl hover:shadow-md hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{it.submitted}</span>
                  </div>
                  <div className="mt-1 text-lg font-semibold flex items-center gap-2">
                    <span>{pickIcon(it.type)}</span>
                    <span>{it.type}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground overflow-hidden text-ellipsis">
                    {it.desc}
                  </p>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-xs rounded-md px-2 py-1 bg-secondary text-secondary-foreground border border-border">
                      Dept: {it.department}
                    </span>
                    <span className="text-xs rounded-full px-2 py-1 bg-success/10 text-success border border-border">
                      {it.status}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            )))}
          </CarouselContent>
          <CarouselPrevious className="bg-background/80 backdrop-blur border border-border" />
          <CarouselNext className="bg-background/80 backdrop-blur border border-border" />
        </Carousel>
      </div>
    </section>
  );
}

function pickIcon(type: string) {
  const key = type.toLowerCase();
  if (key.includes("garbage")) return <Trash2 className="w-5 h-5 text-accent animate-in fade-in duration-300" />;
  if (key.includes("water")) return <Droplets className="w-5 h-5 text-accent animate-in fade-in duration-300" />;
  if (key.includes("light")) return <Lightbulb className="w-5 h-5 text-accent animate-in fade-in duration-300" />;
  return <AlertTriangle className="w-5 h-5 text-accent animate-in fade-in duration-300" />;
}
