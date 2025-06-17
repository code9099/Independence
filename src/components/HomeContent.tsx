
import OfficerDetailsCard from "@/components/OfficerDetailsCard";
import Leaderboard from "@/components/Leaderboard";
import UserDashboard from "@/components/UserDashboard";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();

  // Show dashboard for authenticated users
  if (user) {
    return (
      <main className="flex flex-1 pt-28 px-6 md:px-12 xl:px-32 gap-8 w-full transition-all duration-300 flex-col animate-stagger flair-wave">
        {/* User Dashboard */}
        <div className="crazy-bounce">
          <UserDashboard />
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

  // Fallback content (shouldn't be reached due to ProtectedRoute)
  return (
    <main className="flex flex-1 pt-28 px-6 md:px-12 xl:px-32 gap-8 w-full transition-all duration-300 flex-col animate-stagger flair-wave">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Welcome to JanConnect</h1>
        <p className="text-gray-600">Please sign in to access your dashboard.</p>
      </div>
    </main>
  );
}
