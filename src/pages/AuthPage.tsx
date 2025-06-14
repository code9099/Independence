
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useSession from "@/hooks/useSession";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: userLoading } = useSession();

  // Already signed in? Go home.
  if (user && !userLoading) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const redirectTo = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) throw error;
      }
      setTimeout(() => navigate("/"), 400); // slight delay for session to refresh
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-pink-50 to-purple-50">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-xl shadow-xl border w-full max-w-sm flex flex-col gap-4 animate-fade-in"
      >
        <h1 className="font-black text-3xl mb-2 text-pink-700 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>
        <Input
          placeholder="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error ? (
          <div className="text-red-500 text-sm text-center">{error}</div>
        ) : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
        </Button>
        <div className="text-sm text-center">
          {mode === "login" ? (
            <>
              New to JanConnect?{" "}
              <button
                type="button"
                className="text-pink-600 font-semibold hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-pink-600 font-semibold hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
