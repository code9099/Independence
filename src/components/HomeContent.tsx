import OfficerDetailsCard from "@/components/OfficerDetailsCard";
import Leaderboard from "@/components/Leaderboard";
import MyComplaints from "@/components/MyComplaints";
import Threads from "@/components/Threads";
import { IssueCard, IssueCardProps } from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnalyticsCards from "@/components/AnalyticsCards";
import HeroBanner from "@/components/HeroBanner";
import IssuesCarouselRow from "@/components/IssuesCarouselRow";
import CivicHeatmap from "@/components/CivicHeatmap";

const mockIssues: IssueCardProps[] = [
  {
    type: "Garbage Overflow",
    desc: "Large pile of garbage near main street crossing.",
    department: "MCD",
    status: "Pending",
    submitted: "2 min ago"
  },
  {
    type: "Water Leakage",
    desc: "Leakage from water main, heavy flow, please fix urgently.",
    department: "PWD",
    status: "In Progress",
    submitted: "10 min ago"
  },
  {
    type: "Streetlight Broken",
    desc: "Multiple lights not working in Green Park.",
    department: "PWD",
    status: "Resolved",
    submitted: "1h ago"
  },
];

export default function HomeContent() {
  const navigate = useNavigate();

  const resolvedStories: IssueCardProps[] = mockIssues.map((i) => ({ ...i, status: "Resolved", submitted: "Recently" }));
  const topDepts: IssueCardProps[] = [
    { type: "PWD", desc: "Roads, lighting, water works", department: "PWD", status: "Resolved", submitted: "This week" },
    { type: "MCD", desc: "Sanitation & waste services", department: "MCD", status: "In Progress", submitted: "This week" },
    { type: "DJB", desc: "Water supply & quality", department: "DJB", status: "Resolved", submitted: "This week" },
  ];

  return (
    <main className="flex flex-1 pt-28 px-6 md:px-12 xl:px-32 gap-8 w-full transition-all duration-300 flex-col">
      <HeroBanner />
      <AnalyticsCards />
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          onClick={() => navigate("/report")}
          className="card-premium p-4 cursor-pointer hover-scale group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Report Issue</h3>
              <p className="text-sm text-muted-foreground">Submit new complaint</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigate("/my-complaints")}
          className="card-premium p-4 cursor-pointer hover-scale group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Track Complaints</h3>
              <p className="text-sm text-muted-foreground">View your submissions</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigate("/heatmap")}
          className="card-premium p-4 cursor-pointer hover-scale group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">View Heatmap</h3>
              <p className="text-sm text-muted-foreground">See area problems</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-4">
        <OfficerDetailsCard constituency="New Delhi" />
      </div>
      
      <div className="flex gap-8 w-full">
        {/* Center: Civic Issue Activity & Threads */}
        <section className="flex-1 max-w-3xl mx-auto flex flex-col gap-8">
          {/* Issues Activity Board */}
          <IssuesCarouselRow title="Trending near you" items={[...mockIssues, ...mockIssues, ...mockIssues]} />
          <IssuesCarouselRow title="Resolved Success Stories" items={[...resolvedStories, ...resolvedStories]} />
          <IssuesCarouselRow title="Top Departments" items={[...topDepts, ...topDepts, ...topDepts]} />
          <div className="pt-4">
            <Threads />
          </div>
        </section>
        {/* Right: Leaderboard */}
        <aside className="hidden xl:flex flex-col w-[300px] shrink-0 pt-0 sticky top-28 self-start">
          <Leaderboard />
          <div className="mt-6 card-premium p-3">
            <h3 className="font-semibold mb-2">Live Issue Heatmap</h3>
            <div className="rounded-xl overflow-hidden">
              <CivicHeatmap />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
