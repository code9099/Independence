
/**
 * Profile Page Component
 * 
 * Allows users to view and edit their profile information.
 * Currently uses mock data since authentication is removed.
 */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock user data since we're assuming user is always logged in
// In a real app, this would come from your authentication system
const mockUser = {
  email: "user@janconnect.com",
  id: "mock-user-id"
};

export default function ProfilePage() {
  // State for editable username
  const [username, setUsername] = useState("Demo User");
  const [initialUsername, setInitialUsername] = useState("Demo User");
  
  // UI state for save operation
  const [saving, setSaving] = useState(false);
  const [savingMsg, setSavingMsg] = useState<string | null>(null);

  /**
   * Handles profile form submission
   * Simulates saving user profile data
   */
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavingMsg(null);

    // Mock save operation with artificial delay
    // In a real app, this would make an API call to update user data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the initial username to reflect saved state
    setInitialUsername(username);
    setSavingMsg("Profile updated!");
    setSaving(false);
  }

  return (
    <div className="app-container my-12">
      <div className="max-w-lg mx-auto p-8 bg-white/70 rounded-2xl shadow-md border border-blue-100 flex flex-col gap-6 animate-fade-in flair-wave spin-in">
      {/* Page title */}
      <h2 className="font-black text-3xl text-blue-900 mb-2 crazy-bounce">
        My Profile
      </h2>
      
      {/* Read-only email field */}
      <div className="swing-in">
        <label className="block font-bold mb-1">Email</label>
        <div className="bg-gray-100 rounded-md px-4 py-2">
          {mockUser.email}
        </div>
      </div>
      
      {/* Editable profile form */}
      <form onSubmit={saveProfile} className="flex flex-col gap-4 animate-stagger">
        <label className="block font-bold">Username</label>
        <Input
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="max-w-xs"
        />
        
        {/* Save button - disabled when saving or no changes made */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={saving || username === initialUsername}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
        
        {/* Success message display */}
        {savingMsg && (
          <div className="text-green-600 text-sm">{savingMsg}</div>
        )}
      </form>
      </div>
    </div>
  );
}
