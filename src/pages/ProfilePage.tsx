
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

export default function ProfilePage() {
  const { user, loading: sessionLoading } = useSession();
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingMsg, setSavingMsg] = useState<string | null>(null);

  // Fetch current profile
  useEffect(() => {
    if (!user) return;
    setError(null);

    supabase.from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (data) {
          setUsername(data.username ?? "");
          setInitialUsername(data.username ?? "");
        }
      });
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setError(null); setSavingMsg(null);

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (error) setError(error.message);
    else {
      setInitialUsername(username);
      setSavingMsg("Profile updated!");
    }
    setSaving(false);
  }

  if (sessionLoading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8 text-red-500">You are not logged in.</div>;

  return (
    <div className="max-w-lg mx-auto my-12 p-8 bg-white/70 rounded-2xl shadow-md border border-blue-100 flex flex-col gap-6 animate-fade-in flair-wave spin-in">
      <h2 className="font-black text-3xl text-blue-900 mb-2 crazy-bounce">
        My Profile
      </h2>
      <div className="swing-in">
        <label className="block font-bold mb-1">Email</label>
        <div className="bg-gray-100 rounded-md px-4 py-2">{user.email}</div>
      </div>
      <form onSubmit={saveProfile} className="flex flex-col gap-4 animate-stagger">
        <label className="block font-bold">Username</label>
        <Input
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={saving || username === initialUsername}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
        {savingMsg && <div className="text-green-600 text-sm">{savingMsg}</div>}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
    </div>
  );
}
