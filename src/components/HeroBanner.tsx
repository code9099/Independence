import { AlertTriangle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BackgroundParticles from "@/components/BackgroundParticles";

export default function HeroBanner() {
  const navigate = useNavigate();
  return (
    <section
      aria-label="Hero"
      className="relative hero-gradient rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="absolute inset-0 bg-background/20" />
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundParticles />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-14 md:py-20 text-center text-primary-foreground">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
          Make Your City Better
          <span className="block text-gradient">Report. Track. Resolve.</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          A professional civic platform with an engaging, modern, cinematic feel.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" variant="hero" onClick={() => navigate("/report")}>
            <AlertTriangle className="w-5 h-5 mr-2" /> Report an Issue
          </Button>
          <Button size="lg" variant="glass" onClick={() => navigate("/threads")}>
            <MessageCircle className="w-5 h-5 mr-2" /> Explore Threads
          </Button>
        </div>
      </div>
    </section>
  );
}
