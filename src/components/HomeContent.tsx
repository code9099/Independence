import OfficerDetailsCard from "@/components/OfficerDetailsCard";
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
    <main className="flex flex-1 w-full transition-all duration-300 flex-col">
      <div className="app-container pt-24 page-stack">
        <HeroBanner />
        <AnalyticsCards />
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
        
        {/* Full-width content blocks */}
        <IssuesCarouselRow title="Trending near you" items={[...mockIssues, ...mockIssues, ...mockIssues]} fullBleed />
        <IssuesCarouselRow title="Resolved Success Stories" items={[...resolvedStories, ...resolvedStories]} fullBleed />

        {/* Global FAB for quick reporting */}
        <button
          onClick={() => navigate('/report')}
          className="fixed bottom-6 right-6 z-40 rounded-full px-5 py-3 btn-gradient shadow-lg hover:shadow-xl hover:scale-105 transition focus-ring"
          aria-label="Report an issue"
        >
          Report an Issue
        </button>
        
        {/* Threads and Heatmap within container */}
        <section className="flex-1 mx-auto flex flex-col gap-8 min-w-0">
          <div className="pt-4">
            <Threads />
          </div>
          <div className="mt-6 card-premium p-4">
            <h3 className="font-semibold mb-2">Live Issue Heatmap</h3>
            <div className="rounded-xl overflow-hidden">
              <CivicHeatmap />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
