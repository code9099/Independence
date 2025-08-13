import { IssueCardProps } from "@/components/IssueCard";
import { AlertTriangle, Droplets, Lightbulb, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type IssuesCarouselRowProps = {
  title: string;
  items: IssueCardProps[];
};

export default function IssuesCarouselRow({ title, items }: IssuesCarouselRowProps) {
  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="font-semibold text-2xl md:text-3xl text-gradient">{title}</h2>
      <div className="relative">
        <Carousel opts={{ align: "start" }} className="relative">
          <CarouselContent className="row-mask">
            {items.map((it, idx) => (
              <CarouselItem
                key={`${it.type}-${idx}`}
                className="basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <div className="group shine-on-hover glass-panel p-4 min-h-[180px] flex flex-col rounded-xl hover-scale">
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
            ))}
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
  if (key.includes("garbage")) return <Trash2 className="w-5 h-5 text-accent" />;
  if (key.includes("water")) return <Droplets className="w-5 h-5 text-accent" />;
  if (key.includes("light")) return <Lightbulb className="w-5 h-5 text-accent" />;
  return <AlertTriangle className="w-5 h-5 text-accent" />;
}
