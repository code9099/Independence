import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  end: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export default function CountUp({ end, duration = 1600, prefix = "", suffix = "", decimals = 0 }: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current) return;

    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const start = 0;
            const animate = (now: number) => {
              const progress = Math.min(1, (now - startTime) / duration);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = start + (end - start) * eased;
              setValue(current);
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [duration, end]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString(undefined, { maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
