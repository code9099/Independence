
import { Link } from "react-router-dom";
import { User, Settings, LogIn, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileMenu() {
  const { user, signOut } = useAuth();

  return (
    <DropdownMenu>
      {/* Avatar button that triggers the dropdown */}
      <DropdownMenuTrigger asChild>
        <button className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 hover:scale-105 focus:ring-2 ring-pink-300 transition shadow-md bg-gradient-to-br from-blue-200 to-pink-200 flex items-center justify-center">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-blue-900">
              {(user?.email || 'U').charAt(0).toUpperCase()}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      
      {/* Dropdown menu content */}
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {user ? (
          <>
            <div className="px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300">
              <div className="font-medium">{user.fullName || 'User'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
            </div>
            <DropdownMenuSeparator />
          </>
        ) : null}
        
        {/* Profile link */}
        {user ? (
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center gap-2">
              <User size={16} /> Profile
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/login" className="flex items-center gap-2">
              <LogIn size={16} /> Log in
            </Link>
          </DropdownMenuItem>
        )}
        
        {/* Settings link */}
        {user ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings size={16} /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => { await signOut(); }} className="flex items-center gap-2 cursor-pointer">
              <LogOut size={16} /> Sign out
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
