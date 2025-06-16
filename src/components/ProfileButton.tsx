
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileButton() {
  const navigate = useNavigate();

  // Always show profile button since we're assuming user is logged in
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
        onClick={() => {
          // Since no real logout, just go to home for "logout"
          navigate("/");
        }}
      >
        <LogOut className="mr-2" /> Logout
      </Button>
    </div>
  );
}
