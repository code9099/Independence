import OfficerDetailsCard from "@/components/OfficerDetailsCard";
import Leaderboard from "@/components/Leaderboard";
import MyComplaints from "@/components/MyComplaints";
import Threads from "@/components/Threads";
import { IssueCard, IssueCardProps } from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <main className="flex flex-1 pt-28 px-6 md:px-12 xl:px-32 gap-8 w-full transition-all duration-300 flex-col animate-stagger flair-wave">
      {/* Welcome Section with Report Problem Button */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-pink-400 text-white p-6 rounded-lg shadow-lg crazy-bounce">
        <h1 className="text-3xl font-bold mb-2">Welcome to JanConnect</h1>
        <p className="text-lg opacity-90 mb-4">Delhi's Civic Reporting Platform</p>
        <Button 
          onClick={() => navigate("/report")}
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          Report a Problem
        </Button>
      </div>
      
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          onClick={() => navigate("/report")}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-4 cursor-pointer hover:bg-red-100 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-red-800">Report Issue</h3>
              <p className="text-sm text-red-600">Submit new complaint</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigate("/my-complaints")}
          className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 cursor-pointer hover:bg-blue-100 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-800">Track Complaints</h3>
              <p className="text-sm text-blue-600">View your submissions</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => navigate("/heatmap")}
          className="bg-green-50 border-2 border-green-200 rounded-xl p-4 cursor-pointer hover:bg-green-100 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-800">View Heatmap</h3>
              <p className="text-sm text-green-600">See area problems</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Officer/MLA Details Card */}
      <div className="crazy-bounce">
        <OfficerDetailsCard constituency="New Delhi" />
      </div>
      
      <div className="flex gap-8 w-full">
        {/* Center: Civic Issue Activity & Threads */}
        <section className="flex-1 max-w-3xl mx-auto flex flex-col gap-8 animate-stagger">
          {/* Issues Activity Board */}
          <div className="flair-wave">
            <h2 className="font-semibold text-2xl text-blue-900 mb-2 flex items-center gap-2">
              Live Civic Issues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockIssues.map((issue, idx) =>
                <IssueCard key={idx} {...issue} />
              )}
            </div>
          </div>
          {/* Community Threads */}
          <div className="pt-4 spin-in">
            <Threads />
          </div>
        </section>
        {/* Right: Leaderboard */}
        <aside className="hidden xl:flex flex-col w-[300px] shrink-0 pt-0 sticky top-28 self-start animate-fade-in crazy-bounce">
          <Leaderboard />
        </aside>
      </div>
    </main>
  );
}
