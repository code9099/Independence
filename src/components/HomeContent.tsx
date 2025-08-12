import OfficerDetailsCard from "@/components/OfficerDetailsCard";
import Leaderboard from "@/components/Leaderboard";
import MyComplaints from "@/components/MyComplaints";
import Threads from "@/components/Threads";
import { IssueCard, IssueCardProps } from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnalyticsCards from "@/components/AnalyticsCards";

// Mock issues (as before)
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

  return (
    <main className="flex flex-1 pt-28 px-6 md:px-12 xl:px-32 gap-8 w-full transition-all duration-300 flex-col">
      <div className="text-center card-premium p-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gradient">JanConnect – Professional Civic Solutions</h1>
        <p className="text-base text-muted-foreground mb-5">A reliable platform to report, track, and resolve civic issues.</p>
        <Button onClick={() => navigate("/report")} size="lg" className="btn-gradient hover:opacity-90 transition-opacity">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Report an Issue
        </Button>
      </div>
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
      
      <div>
        <OfficerDetailsCard constituency="New Delhi" />
      </div>
      
      <div className="flex gap-8 w-full">
        {/* Center: Civic Issue Activity & Threads */}
        <section className="flex-1 max-w-3xl mx-auto flex flex-col gap-8">
          {/* Issues Activity Board */}
          <div>
            <h2 className="font-semibold text-2xl text-gradient mb-2 flex items-center gap-2">
              Live Civic Issues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockIssues.map((issue, idx) =>
                <IssueCard key={idx} {...issue} />
              )}
            </div>
          </div>
      <div className="pt-4">
        <Threads />
      </div>
        </section>
        {/* Right: Leaderboard */}
        <aside className="hidden xl:flex flex-col w-[300px] shrink-0 pt-0 sticky top-28 self-start">
          <Leaderboard />
        </aside>
      </div>
    </main>
  );
}
