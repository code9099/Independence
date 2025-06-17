
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileButton() {
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
    </div>
  );
}
