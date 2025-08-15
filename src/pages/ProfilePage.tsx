
/**
 * Profile Page Component
 * 
 * Allows users to view and edit their profile information.
 * Currently uses mock data since authentication is removed.
 */

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function ProfilePage() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  
  // UI state for save operation
  const [saving, setSaving] = useState(false);
  const [savingMsg, setSavingMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setEmail(user.email);
      // Load profile
      const { data, error } = await supabase
        // Cast to any to avoid mismatch with generated types file
        .from('profiles' as any)
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setUsername(data.full_name || "");
        setInitialUsername(data.full_name || "");
      }
    })();
  }, [user]);

  /**
   * Handles profile form submission
   * Simulates saving user profile data
   */
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavingMsg(null);

    try {
      if (!user) return;
      const { error } = await supabase
        // Cast to any to avoid mismatch with generated types file
        .from('profiles' as any)
        .update({ full_name: username })
        .eq('id', user.id);
      if (error) throw error;
      setInitialUsername(username);
      setSavingMsg("Profile updated!");
    } catch (err: any) {
      setSavingMsg(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
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
          {email ?? '—'}
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
