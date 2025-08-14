
import React from "react";
import { useConstituencies } from "@/hooks/useConstituencies";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface ConstituencySelectorProps {
  value: string | null;
  onChange: (val: string) => void;
}

const ConstituencySelector: React.FC<ConstituencySelectorProps> = ({ value, onChange }) => {
  const { data: constituencies, isLoading, refetch, error } = useConstituencies();

  React.useEffect(() => {
    if (error) {
      // handled with UI message below
    }
  }, [error]);

  // Optionally, on dropdown focus, refetch data (handles new additions immediately)
  const handleFocus = () => {
    refetch();
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-2 py-6 justify-center text-primary">
        <Loader2 className="animate-spin" /> Loading constituencies...
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 py-2">
        Unable to load constituencies. Please try again later.
      </div>
    );

  return (
    <Select
      value={value || ""}
      onValueChange={(val) => onChange(val)}
      defaultValue=""
      disabled={isLoading}
    >
      <SelectTrigger
        className="w-full px-4 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring bg-card text-card-foreground font-semibold"
        onFocus={handleFocus}
      >
        <SelectValue placeholder="Select your constituency..." />
      </SelectTrigger>
      <SelectContent
        className="max-h-80 bg-popover text-popover-foreground border border-border z-50"
        position="popper"
      >
        {Array.isArray(constituencies) && constituencies.length > 0 ? (
          constituencies.map((c: any) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="" disabled>
            No constituencies found.
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default ConstituencySelector;
