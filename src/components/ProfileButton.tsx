
/**
 * Profile Button Component
 * 
 * Renders navigation buttons for Profile and Logout in the header.
 * Now integrated with Supabase authentication system.
 */

import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // User will be automatically redirected to auth page by ProtectedRoute
  };

  return (
    <div className="flex items-center gap-2">
      {/* Profile navigation link */}
      <Link
        to="/profile"
        className="rounded-full focus:ring-2 focus:ring-pink-300 group transition"
      >
        <Button variant="ghost" className="px-2 py-1">
          <User className="mr-2" /> Profile
        </Button>
      </Link>
      
      {/* Logout button */}
      <Button
        variant="ghost"
        className="px-2 py-1"
        onClick={handleLogout}
      >
        <LogOut className="mr-2" /> Logout
      </Button>
    </div>
  );
}
