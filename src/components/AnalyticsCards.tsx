import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

export default function AnalyticsCards() {
  const stats = [
    {
      label: "Issues Resolved",
      value: "1,248",
      sub: "+32 this week",
      Icon: CheckCircle2,
    },
    { label: "Avg Response Time", value: "18h", sub: "Last 30 days", Icon: Clock },
    { label: "Success Rate", value: "92%", sub: "SLA within 72h", Icon: TrendingUp },
  ];

  return (
    <section aria-label="Platform analytics" className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map(({ label, value, sub, Icon }) => (
        <article
          key={label}
          className="card-premium p-4 flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Icon size={20} />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold leading-tight">{value}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        </article>
      ))}
    </section>
  );
}
