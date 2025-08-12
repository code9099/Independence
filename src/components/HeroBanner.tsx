import { AlertTriangle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();
  return (
    <section
      aria-label="Hero"
      className="relative hero-gradient rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="absolute inset-0 bg-background/20" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 py-12 md:py-16 text-center text-primary-foreground">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Make Your City Better
          <span className="block text-gradient">Report. Track. Resolve.</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-primary-foreground/90">
          A professional civic platform with an engaging, modern feel.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button size="lg" className="btn-gradient hover:opacity-90" onClick={() => navigate("/report")}>
            <AlertTriangle className="w-5 h-5 mr-2" /> Report an Issue
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate("/threads")}>
            <MessageCircle className="w-5 h-5 mr-2" /> Explore Threads
          </Button>
        </div>
      </div>
    </section>
  );
}
