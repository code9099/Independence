
/**
 * Profile Button Component
 * 
 * Renders navigation buttons for Profile and Logout in the header.
 * Uses React Router for navigation between pages.
 */

import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileButton() {
  const navigate = useNavigate();

  // Always show profile button since we're assuming user is logged in
  // In a real app, this would be conditionally rendered based on auth status
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
      
      {/* Logout button - currently just navigates to home */}
      <Button
        variant="ghost"
        className="px-2 py-1"
        onClick={() => {
          // Since no real logout functionality, just redirect to home
          // In a real app, this would:
          // 1. Clear user session/tokens
          // 2. Call logout API
          // 3. Redirect to login page
          navigate("/");
        }}
      >
        <LogOut className="mr-2" /> Logout
      </Button>
    </div>
  );
}
