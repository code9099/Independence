
import { Home, Users, MessageCircle, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DarkModeToggle from "@/components/DarkModeToggle";
import ProfileMenu from "@/components/ProfileMenu";
import { useAuth } from "@/contexts/AuthContext";

// Static navLinks
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
  const { user } = useAuth();
  return (
    <header className={`w-full sticky top-0 z-20 flex items-center justify-between py-3 px-4 md:px-6 h-16 ${transparent ? "bg-background/60" : "bg-background/60"} backdrop-blur border-b border-border shadow-sm`}>
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="mr-2" />
        <span className="inline-flex items-center gap-2 px-0 py-0">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shadow-sm">
            <ShieldCheck size={22} />
          </span>
          <span className="text-2xl font-bold text-gradient tracking-tight">JanConnect</span>
        </span>
        <span className="hidden md:inline ml-3 text-sm font-medium text-muted-foreground">
          Professional Civic Solutions
        </span>
      </div>
      {/* Center: Navigation */}
      <nav className="hidden md:flex gap-2 md:gap-4 items-center relative">
        {navLinks.map((nav) => (
          <NavLink
            to={nav.url}
            key={nav.label}
            className={({ isActive }) =>
              `group flex flex-col items-center px-3 py-1 rounded-xl transition-colors relative ${
                isActive ? "text-primary" : "text-foreground"
              }`
            }
          >
            <nav.icon size={26} className="mb-1 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs font-medium group-hover:text-primary transition-colors">{nav.label}</span>
            <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 bg-primary transition-all duration-300 group-[.active]:w-8 group-[.active]:left-1/2 group-hover:w-8" />
          </NavLink>
        ))}
      </nav>
      {/* Right: Actions (Dark Mode + ProfileMenu only) */}
      <div className="flex items-center gap-2 md:gap-4">
        <DarkModeToggle />
        {user ? (
          <ProfileMenu />
        ) : (
          <NavLink to="/login" className="px-3 py-1 rounded-lg border border-border text-sm">
            Log in
          </NavLink>
        )}
      </div>
    </header>
  );
}
