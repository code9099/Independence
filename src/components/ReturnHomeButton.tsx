
import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const cuteColors = [
  "from-pink-300 via-yellow-200 to-pink-300",
  "from-sky-300 via-fuchsia-300 to-pink-200",
  "from-purple-300 via-pink-200 to-rose-300",
];

export default function ReturnHomeButton() {
  // Home page doesn't need the button
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  return (
    <Link
      to="/"
      aria-label="Return to main (home) page"
      className={`
        fixed top-6 right-6 z-[60] p-0.5 
        rounded-full shadow-2xl border-4 border-pink-200 
        bg-gradient-to-tr ${cuteColors[0]}
        hover:scale-110 active:scale-95 transition-transform duration-200 group
        animate-fade-in
      `}
      style={{ boxShadow: "0 4px 32px 2px rgba(255,60,180,0.14)" }}
    >
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="inline-block">
          <Home
            size={28}
            strokeWidth={2.2}
            className="text-pink-600 group-hover:text-fuchsia-700 drop-shadow-glow"
          />
        </span>
        <span className="font-bold tracking-tight text-pink-700 text-lg group-hover:text-fuchsia-600 transition-colors animate-pulse select-none">
          Main Page
        </span>
        <span className="animate-bounce ml-1">🦄</span>
      </div>
    </Link>
  );
}
