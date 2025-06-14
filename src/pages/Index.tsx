import ReportProblem from "@/components/ReportProblem";
import Leaderboard from "@/components/Leaderboard";
import Threads from "@/components/Threads";
import { IssueCard, IssueCardProps } from "@/components/IssueCard";
import DarkModeToggle from "@/components/DarkModeToggle";

// Fix: Add typing for mockIssues to ensure the status field matches IssueCardProps
const mockIssues: IssueCardProps[] = [
  {
    id: 1 as never, // Will remove the id when spreading below, just to satisfy TS
    type: "Garbage Overflow",
    desc: "Large pile of garbage near main street crossing.",
    department: "MCD",
    status: "Pending",
    submitted: "2 min ago"
  },
  {
    id: 2 as never,
    type: "Water Leakage",
    desc: "Leakage from water main, heavy flow, please fix urgently.",
    department: "PWD",
    status: "In Progress",
    submitted: "10 min ago"
  },
  {
    id: 3 as never,
    type: "Streetlight Broken",
    desc: "Multiple lights not working in Green Park.",
    department: "PWD",
    status: "Resolved",
    submitted: "1h ago"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full flex items-center justify-between py-6 px-10 bg-white/90 border-b border-muted fixed z-20 top-0 left-0 h-20">
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-blue-800 select-none">
          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-lg shadow-sm mr-3 text-lg font-bold">JanConnect</span>
          <span className="hidden md:inline text-gray-700">Civic Issue Reporting & Community</span>
        </div>
        <DarkModeToggle />
      </header>
      <main className="flex flex-1 pt-28 px-6 md:px-12 xl:px-32 gap-8 w-full transition-all duration-300">
        {/* Left: Report a Problem */}
        <aside className="hidden lg:flex flex-col w-96 xl:w-[380px] shrink-0 sticky top-28 self-start animate-fade-in">
          <ReportProblem />
        </aside>

        {/* Center: Civic Issue Activity & Threads */}
        <section className="flex-1 max-w-3xl mx-auto flex flex-col gap-8">
          {/* Issues Activity Board */}
          <div>
            <h2 className="font-semibold text-2xl text-blue-900 mb-2 flex items-center gap-2">
              Live Civic Issues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockIssues.map(({ id, ...issueProps }, idx) =>
                <IssueCard key={idx} {...issueProps} />
              )}
            </div>
          </div>

          {/* Community Threads */}
          <div className="pt-4">
            <Threads />
          </div>
        </section>

        {/* Right: Leaderboard */}
        <aside className="hidden xl:flex flex-col w-[300px] shrink-0 pt-0 sticky top-28 self-start animate-fade-in">
          <Leaderboard />
        </aside>
      </main>
      <footer className="mt-16 py-8 px-4 text-xs text-center text-muted-foreground bg-transparent">
        &copy; {new Date().getFullYear()} JanConnect &middot; Civic Tech for All
      </footer>
    </div>
  );
};

export default Index;
