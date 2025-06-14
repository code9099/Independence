
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Check } from "lucide-react";

const DarkModeToggle = () => {
  const [mode, setMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <button
      className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-800 transition-colors text-gray-700 dark:text-gray-100"
      onClick={() => setMode(m => (m === "dark" ? "light" : "dark"))}
      aria-label="Toggle dark mode"
      type="button"
    >
      {mode === "dark" ? <Sun className="w-5 h-5" /> : <Check className="w-5 h-5" />}
      <span className="font-medium">{mode === "dark" ? "Light" : "Dark"} Mode</span>
    </button>
  );
};
export default DarkModeToggle;
