
import React from "react";
import { ArrowUp, Check, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IssueCardProps {
  type: string;
  desc: string;
  department: string;
  status: "Pending" | "In Progress" | "Resolved";
  submitted: string;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  type, desc, department, status, submitted
}) => {
  let badge, statusColor, icon;
  if (status === "Pending") {
    badge = "⏳";
    statusColor = "";
    icon = <ArrowUp className="w-5 h-5 text-orange-400 inline mb-0.5" />;
  } else if (status === "In Progress") {
    badge = "🔄";
    statusColor = "";
    icon = <ArrowUp className="w-5 h-5 text-blue-400 inline mb-0.5" />;
  } else {
    badge = "✅";
    statusColor = "";
    icon = <Check className="w-5 h-5 text-green-500 inline mb-0.5" />;
  }
  return (
    <div className={cn(
      "group rounded-2xl p-5 border flex flex-col gap-3 bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
      statusColor
    )}>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
          {badge}
        </span>
        <span className="font-semibold tracking-tight">{type}</span>
        <span className="ml-auto text-xs text-muted-foreground">{submitted}</span>
      </div>
      <div className="text-sm text-muted-foreground line-clamp-3">{desc}</div>
      <div className="flex items-center gap-3 text-sm pt-1">
        <span className="rounded-md px-2 py-0.5 bg-secondary text-secondary-foreground border border-border">Dept: {department}</span>
        <span className="rounded-full px-2 py-0.5 ml-auto flex items-center gap-1 bg-success/10 text-success border border-border">
          {icon} {status}
        </span>
      </div>
    </div>
  );
};
