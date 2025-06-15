import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useSession from "@/hooks/useSession";
import ReturnHomeButton from "@/components/ReturnHomeButton";

// Unsplash images for visual appeal
const images = [
  "photo-1488590528505-98d2b5aba04b",
  "photo-1581091226825-a6a2a5aee158",
  "photo-1649972904349-6e44c42644a7",
  "photo-1721322800607-8c38375eef04",
];

const randomIndex = Math.floor(Math.random() * images.length);

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, loading: userLoading } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (!userLoading && user) {
      navigate("/");
    }
  }, [user, userLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      let authError: any = null;

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        authError = error;
      } else {
        const redirectTo = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo }
        });
        authError = error;
      }

      if (authError) {
        setError(authError.message ?? "Authentication failed.");
        setLoading(false);
        return;
      }

      // Slight delay to ensure session is set before redirection
      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  // Loading state while checking session
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-sky-100 spin-in flair-wave">
        <span className="text-xl text-blue-700 font-semibold animate-pulse crazy-bounce">Loading...</span>
      </div>
    );
  }

  // Show form only if not logged in
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-sky-100 relative overflow-hidden animate-fade-in spin-in flair-wave">
      <ReturnHomeButton />
      <div className="w-full max-w-3xl mx-4 md:mx-0 flex flex-col md:flex-row bg-white/80 rounded-3xl shadow-xl border-4 border-pink-200 overflow-hidden crazy-bounce">
        {/* Side image panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-fuchsia-100 via-pink-100 to-blue-100 p-8 md:w-1/2 relative animate-scale-in swing-in">
          <img
            src={`https://images.unsplash.com/${images[randomIndex]}?auto=format&fit=facearea&w=400&h=400&q=80`}
            alt="Login visual"
            className="rounded-2xl shadow-2xl mb-6 object-cover w-64 h-64"
            draggable={false}
          />
          <h2 className="font-black text-2xl mb-2 text-pink-600 text-center drop-shadow animate-pulse">
            Welcome to <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">JanConnect</span>!
          </h2>
          <p className="text-pink-800 text-center font-medium">Gen Z Civic Pulse for Delhi 🚀<br />Join the wave. Be the change.</p>
        </div>
        {/* Auth form panel */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-center gap-5 p-8 md:p-16 bg-white/90 md:w-1/2 animate-stagger"
        >
          <h1 className="font-black text-4xl mb-2 text-center text-pink-700 crazy-bounce">
            {mode === "login" ? "Log In" : "Create Account"}
          </h1>
          <div className="flex justify-center mb-2 swing-in">
            <span className="text-3xl animate-bounce">🦄</span>
          </div>
          <Input
            placeholder="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="shadow-sm"
          />
          <Input
            placeholder="Password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="shadow-sm"
          />
          {error && (
            <div className="text-red-500 text-xs mb-2 text-center animate-fade-in">{error}</div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold text-lg py-2 px-6 hover:scale-105 shadow-lg transition-all duration-200"
          >
            {loading ? (
              <span className="animate-pulse">Please wait...</span>
            ) : (
              mode === "login" ? "Log In 🚀" : "Sign Up 🥳"
            )}
          </Button>
          <div className="text-sm text-center mt-4 font-medium">
            {mode === "login" ? (
              <>
                New to JanConnect?{" "}
                <button
                  type="button"
                  className="text-pink-600 font-bold underline underline-offset-2 hover:text-blue-500 transition-all"
                  onClick={() => { setMode("signup"); setError(null); }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-pink-600 font-bold underline underline-offset-2 hover:text-blue-500 transition-all"
                  onClick={() => { setMode("login"); setError(null); }}
                >
                  Log In
                </button>
              </>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <span className="bg-gradient-to-r from-sky-300 to-pink-300 text-2xl rounded-full px-3 py-1 animate-pulse">
              {mode === "login" ? "💡" : "🌱"}
            </span>
          </div>
        </form>
      </div>
      {/* Floating background hearts/cute shapes */}
      <div className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-0">
        <span className="text-pink-300 text-6xl animate-bounce-slow flair-wave">💗</span>
      </div>
      <div className="pointer-events-none absolute bottom-10 left-10 text-purple-200 text-7xl animate-bounce-slow swing-in" style={{ animationDelay: "800ms" }}>🫧</div>
      <div className="pointer-events-none absolute bottom-8 right-8 text-blue-200 text-8xl animate-bounce-slow crazy-bounce" style={{ animationDelay: "500ms" }}>✨</div>
    </div>
  );
}
