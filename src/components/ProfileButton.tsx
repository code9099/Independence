
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileButton() {
  const { user } = useSession();
  const navigate = useNavigate();

  if (!user) return null;

  // For now, show a generic user icon & logout
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/profile"
        className="rounded-full focus:ring-2 focus:ring-pink-300 group transition"
      >
        <Button variant="ghost" className="px-2 py-1">
          <User className="mr-2" /> Profile
        </Button>
      </Link>
      <Button
        variant="ghost"
        className="px-2 py-1"
        onClick={async () => {
          await supabase.auth.signOut();
          navigate("/auth");
        }}
      >
        <LogOut className="mr-2" /> Logout
      </Button>
    </div>
  );
}
