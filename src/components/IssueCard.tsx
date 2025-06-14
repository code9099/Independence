
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
    statusColor = "bg-orange-100 text-orange-700 border-orange-200";
    icon = <ArrowUp className="w-5 h-5 text-orange-400 inline mb-0.5" />;
  } else if (status === "In Progress") {
    badge = "🔄";
    statusColor = "bg-blue-100 text-blue-700 border-blue-200";
    icon = <ArrowUp className="w-5 h-5 text-blue-400 inline mb-0.5" />;
  } else {
    badge = "✅";
    statusColor = "bg-green-100 text-green-700 border-green-200";
    icon = <Check className="w-5 h-5 text-green-500 inline mb-0.5" />;
  }
  return (
    <div className={cn(
      "rounded-2xl p-5 border flex flex-col gap-2 bg-white dark:bg-muted shadow-lg transition-all animate-fade-in",
      statusColor
    )}>
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">{badge}</span>
        <span className="font-semibold">{type}</span>
        <span className="ml-auto text-xs">{submitted}</span>
      </div>
      <div className="text-gray-600 text-sm py-1">{desc}</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded-md px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200">
          Dept: {department}
        </span>
        <span className="rounded-full px-2 py-0.5 bg-gray-100 text-gray-700 ml-auto flex items-center gap-1 border">
          {icon} {status}
        </span>
      </div>
    </div>
  );
};
