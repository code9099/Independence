
import useSession from "@/hooks/useSession";

export default function SettingsPage() {
  const { user, loading } = useSession();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8 text-red-500">You are not logged in.</div>;

  return (
    <div className="max-w-lg mx-auto my-12 p-8 bg-white/70 rounded-2xl shadow-md border border-blue-100 animate-fade-in spin-in crazy-bounce">
      <h2 className="font-black text-3xl text-blue-900 mb-6 flair-wave">
        Settings
      </h2>
      <p className="text-blue-800 animate-bounce">Settings functionality will be coming soon. 🚀</p>
    </div>
  );
}
