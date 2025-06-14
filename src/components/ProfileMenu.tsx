
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import useSession from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileMenu() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 hover:scale-105 focus:ring-2 ring-pink-300 transition shadow-md bg-gradient-to-br from-blue-200 to-pink-200 flex items-center justify-center"
        >
          <span role="img" aria-label="avatar" className="text-xl">🦄</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2">
            <User size={16} /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2">
            <Settings size={16} /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/20 focus:text-destructive"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await supabase.auth.signOut();
            setLoading(false);
            navigate("/auth");
          }}
        >
          <LogOut size={16} className="mr-1" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
