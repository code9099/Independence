
import { Home, Users, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "@/components/DarkModeToggle";
import ProfileMenu from "@/components/ProfileMenu";
import useSession from "@/hooks/useSession";

const navLinks = [
  { label: "Home", icon: Home, url: "/" },
  { label: "Threads", icon: MessageCircle, url: "/threads" },
  { label: "Leaderboard", icon: Users, url: "/leaderboard" },
];

type Props = {
  fixed?: boolean;
  transparent?: boolean;
};

export default function AppNavbar({ fixed = true, transparent = false }: Props) {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  return (
    <header className={`w-full flex items-center justify-between py-3 px-5 md:px-10 ${fixed ? "fixed z-20 top-0 left-0 h-20" : ""} ${transparent ? "bg-white/60 backdrop-blur-lg" : "bg-white"} border-b border-blue-200/40 shadow-xl animate-fade-in rounded-b-2xl`}>
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-3">
        <span className="inline-block bg-gradient-to-r from-blue-600 to-pink-400 text-white px-4 py-2 rounded-2xl shadow-md text-2xl font-extrabold tracking-tight drop-shadow-lg hover:scale-105 transition-transform hover:bg-pink-400/80">
          <span className="drop-shadow-xl">JanConnect</span>
        </span>
        <span className="hidden md:inline ml-2 text-lg font-semibold bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
          Delhi’s GenZ Civic Pulse
        </span>
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
  );
}
