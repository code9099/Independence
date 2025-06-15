import OfficerDetailsCard from "@/components/OfficerDetailsCard";
import Leaderboard from "@/components/Leaderboard";
import { useNavigate } from "react-router-dom";
import MyComplaints from "@/components/MyComplaints";
import Threads from "@/components/Threads";
import { IssueCard, IssueCardProps } from "@/components/IssueCard";

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
      {/* Officer/MLA Details Card */}
      <div className="crazy-bounce">
        <OfficerDetailsCard constituency="New Delhi" />
      </div>
      {/* Report a Problem Button */}
      <div className="flex justify-center mb-6 crazy-bounce">
        <button
          onClick={() => navigate("/report")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-400 text-white rounded-2xl shadow-lg font-bold text-lg hover:scale-105 transition transform hover:bg-pink-500 focus:outline-none"
        >
          <span role="img" aria-label="report">📝</span> Report a Problem
        </button>
      </div>
      {/* My Complaints Section */}
      <div className="swing-in"><MyComplaints /></div>
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
