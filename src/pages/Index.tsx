import { Home, Users, MessageCircle } from "lucide-react";
import ReportProblem from "@/components/ReportProblem";
import Leaderboard from "@/components/Leaderboard";
import Threads from "@/components/Threads";
import { IssueCard, IssueCardProps } from "@/components/IssueCard";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Link } from "react-router-dom";

// Remove id fields from mockIssues
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

const navLinks = [
  {
    label: "Home",
    icon: Home,
    url: "/",
  },
  {
    label: "Threads",
    icon: MessageCircle,
    url: "/threads",
  },
  {
    label: "Leaderboard",
    icon: Users,
    url: "/leaderboard",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* GEN Z NAVBAR */}
      <header className="w-full flex items-center justify-between py-3 px-5 md:px-10 fixed z-20 top-0 left-0 h-20 bg-white/60 backdrop-blur-lg border-b border-blue-200/40 shadow-xl animate-fade-in rounded-b-2xl">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <span className="inline-block bg-gradient-to-r from-blue-600 to-pink-400 text-white px-4 py-2 rounded-2xl shadow-md text-2xl font-extrabold tracking-tight drop-shadow-lg hover:scale-105 transition-transform hover:bg-pink-400/80">
            <span className="drop-shadow-xl">JanConnect</span>
          </span>
          <span className="hidden md:inline ml-2 text-lg font-semibold bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-pulse">Delhi’s GenZ Civic Pulse</span>
        </div>
        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-2 md:gap-4 items-center">
          {navLinks.map((nav) =>
            nav.url.startsWith("/") ? (
              <Link
                to={nav.url}
                key={nav.label}
                className="group flex flex-col items-center px-3 py-1 transition-all duration-200 rounded-xl hover:bg-blue-100/70 hover:scale-110 active:bg-blue-200 border border-transparent hover:border-blue-400"
              >
                <nav.icon size={26} className="mb-1 text-blue-700 group-hover:text-pink-500 transition-all" />
                <span className="text-xs font-medium text-blue-900 group-hover:text-pink-500 transition">{nav.label}</span>
              </Link>
            ) : (
              <a
                href={nav.url}
                key={nav.label}
                className="group flex flex-col items-center px-3 py-1 transition-all duration-200 rounded-xl hover:bg-blue-100/70 hover:scale-110 active:bg-blue-200 border border-transparent hover:border-blue-400"
              >
                <nav.icon size={26} className="mb-1 text-blue-700 group-hover:text-pink-500 transition-all" />
                <span className="text-xs font-medium text-blue-900 group-hover:text-pink-500 transition">{nav.label}</span>
              </a>
            )
          )}
        </nav>
        {/* Right: Actions (Dark Mode + Avatar/Btn) */}
        <div className="flex items-center gap-2 md:gap-4">
          <DarkModeToggle />
          <button className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 hover:scale-105 focus:ring-2 ring-pink-300 transition shadow-md bg-gradient-to-br from-blue-200 to-pink-200 flex items-center justify-center">
            <span role="img" aria-label="avatar" className="text-xl">
              🦄
            </span>
          </button>
        </div>
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
              {mockIssues.map((issue, idx) =>
                <IssueCard key={idx} {...issue} />
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
