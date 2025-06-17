
import { Link } from "react-router-dom";
import { User, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function ProfileMenu() {
  // Mock user data since authentication is removed
  const displayName = "Demo User";
  const userEmail = "demo@janconnect.com";
  const userConstituency = "New Delhi";

  return (
    <DropdownMenu>
      {/* Avatar button that triggers the dropdown */}
      <DropdownMenuTrigger asChild>
        <button
          className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 hover:scale-105 focus:ring-2 ring-pink-300 transition shadow-md bg-gradient-to-br from-blue-200 to-pink-200 flex items-center justify-center"
        >
          {/* Display user's initials or emoji */}
          <span className="text-sm font-bold text-blue-900">
            {displayName ? displayName.charAt(0).toUpperCase() : '🦄'}
          </span>
        </button>
      </DropdownMenuTrigger>
      
      {/* Dropdown menu content */}
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {/* User info header */}
        <div className="px-2 py-1.5 text-sm text-gray-600">
          <div className="font-medium">{displayName}</div>
          <div className="text-xs text-gray-500">{userEmail}</div>
          <div className="text-xs text-gray-500">{userConstituency}</div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Profile link */}
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2">
            <User size={16} /> Profile
          </Link>
        </DropdownMenuItem>
        
        {/* Settings link */}
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2">
            <Settings size={16} /> Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
