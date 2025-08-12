import React, { useMemo } from "react";

// Lightweight animated particles using pure CSS and inline styles
// Uses design tokens and keeps it subtle for a cinematic feel
const BackgroundParticles: React.FC = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        size: Math.floor(Math.random() * 8) + 4,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.4 + 0.2,
      })),
    []
  );

  return (
    <div className="absolute inset-0">
      {dots.map((d, idx) => (
        <span
          key={idx}
          className="absolute rounded-full bg-primary/30 dark:bg-primary/40"
          style={{
            width: d.size,
            height: d.size,
            left: `${d.left}%`,
            top: `${d.top}%`,
            opacity: d.opacity,
            filter: "blur(1px)",
            animation: `float ${d.duration}s ease-in-out ${d.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Soft gradient glow */}
      <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-30"
           style={{ background: "var(--gradient-brand)" }} />
      <div className="absolute -bottom-32 -right-24 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-20"
           style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--primary)/0.6), transparent 60%)" }} />
    </div>
  );
};

export default BackgroundParticles;
