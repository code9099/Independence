import { Home, Users, MessageCircle } from "lucide-react";
import ReportProblem from "@/components/ReportProblem";
import Leaderboard from "@/components/Leaderboard";
import Threads from "@/components/Threads";
import { IssueCard, IssueCardProps } from "@/components/IssueCard";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Link, useNavigate } from "react-router-dom";
import useSession from "@/hooks/useSession";
import MyComplaints from "@/components/MyComplaints";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import ProfileMenu from "@/components/ProfileMenu";
import OfficerDetailsCard from "@/components/OfficerDetailsCard";

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
  const { user, loading } = useSession();
  const navigate = useNavigate();

  // Logout handler for AppSidebar to redirect after logout
  const handleLogout = () => {
    navigate("/auth");
  };

  // If user is logged in, show sidebar layout
  if (!loading && user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background spin-in">
          <AppSidebar onLogout={handleLogout} />
          <SidebarInset>
            {/* NAVBAR */}
            <header className="w-full flex items-center justify-between py-3 px-5 md:px-10 fixed z-20 top-0 left-0 h-20 bg-white/60 backdrop-blur-lg border-b border-blue-200/40 shadow-xl animate-fade-in rounded-b-2xl crazy-bounce">
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
              {/* Right: Actions (Dark Mode + ProfileDropdown) */}
              <div className="flex items-center gap-2 md:gap-4">
                <DarkModeToggle />
                <ProfileMenu />
              </div>
            </header>
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
              {/* NEW: My Complaints Section (if user) */}
              {user && (
                <div className="swing-in"><MyComplaints /></div>
              )}
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
            <footer className="mt-16 py-8 px-4 text-xs text-center text-muted-foreground bg-transparent animate-fade-in swing-in">
              &copy; {new Date().getFullYear()} JanConnect &middot; Civic Tech for All
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // Default layout if not logged in:
  return (
    <div className="min-h-screen flex flex-col bg-background spin-in">
      {/* GEN Z NAVBAR */}
      <header className="w-full flex items-center justify-between py-3 px-5 md:px-10 fixed z-20 top-0 left-0 h-20 bg-white/60 backdrop-blur-lg border-b border-blue-200/40 shadow-xl animate-fade-in swing-in rounded-b-2xl">
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
        {/* Right: Actions (Dark Mode + ProfileMenu or Login/Signup) */}
        <div className="flex items-center gap-2 md:gap-4">
          <DarkModeToggle />
          {!loading && user ? (
            // Show profile menu after login/signup, replaces login/signup button
            <ProfileMenu />
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-3 py-1.5 bg-pink-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm md:text-base"
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </header>
      <main className="flex flex-1 pt-28 px-6 md:px-12 xl:px-32 gap-8 w-full transition-all duration-300 flex-col animate-stagger">
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
      <footer className="mt-16 py-8 px-4 text-xs text-center text-muted-foreground bg-transparent animate-fade-in swing-in">
        &copy; {new Date().getFullYear()} JanConnect &middot; Civic Tech for All
      </footer>
    </div>
  );
};

export default Index;
