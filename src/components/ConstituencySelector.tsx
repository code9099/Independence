
import React from "react";
import { useConstituencies } from "@/hooks/useConstituencies";
import { Loader2 } from "lucide-react";

interface ConstituencySelectorProps {
  value: string | null;
  onChange: (val: string) => void;
}

const ConstituencySelector: React.FC<ConstituencySelectorProps> = ({ value, onChange }) => {
  const { data: constituencies, isLoading } = useConstituencies();

  if (isLoading) return (
    <div className="flex items-center gap-2 py-6 justify-center text-blue-700">
      <Loader2 className="animate-spin" /> Loading constituencies...
    </div>
  );

  return (
    <select
      className="block w-full px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-blue-900 font-semibold"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
    >
      <option value="" disabled>Select your constituency...</option>
      {constituencies && constituencies.map((c: any) => (
        <option value={c.id} key={c.id}>{c.name}</option>
      ))}
    </select>
  );
};

export default ConstituencySelector;
