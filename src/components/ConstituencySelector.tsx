
import React from "react";
import { useConstituencies } from "@/hooks/useConstituencies";
import { Loader2 } from "lucide-react";

interface ConstituencySelectorProps {
  value: string | null;
  onChange: (val: string) => void;
}

const ConstituencySelector: React.FC<ConstituencySelectorProps> = ({ value, onChange }) => {
  const { data: constituencies, isLoading, refetch, error } = useConstituencies();

  // Extra debug log for troubleshooting!
  React.useEffect(() => {
    console.log("[ConstituencySelector] Constituencies loaded:", constituencies);
    if (error) {
      console.error("[ConstituencySelector] Error loading constituencies:", error);
    }
  }, [constituencies, error]);

  // Optionally, on dropdown focus, refetch data (handles new additions immediately)
  const handleFocus = () => {
    refetch();
  };

  if (isLoading) return (
    <div className="flex items-center gap-2 py-6 justify-center text-blue-700">
      <Loader2 className="animate-spin" /> Loading constituencies...
    </div>
  );

  if (error) return (
    <div className="text-red-600 py-2">
      Unable to load constituencies. Please try again later.
    </div>
  );

  return (
    <select
      className="block w-full px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-blue-900 font-semibold"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      onFocus={handleFocus}
    >
      <option value="" disabled>Select your constituency...</option>
      {Array.isArray(constituencies) && constituencies.length > 0 ? (
        constituencies.map((c: any) => (
          <option value={c.id} key={c.id}>{c.name}</option>
        ))
      ) : (
        <option value="" disabled>No constituencies found.</option>
      )}
    </select>
  );
};

export default ConstituencySelector;
