import ReportProblem from "@/components/ReportProblem";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReportProblemPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-pink-50 to-blue-100 animate-fade-in spin-in">
      <header className="w-full flex items-center justify-between py-3 px-5 md:px-10 top-0 left-0 h-20 bg-white/60 backdrop-blur-lg border-b border-blue-200/40 shadow-xl animate-fade-in rounded-b-2xl mb-4 crazy-bounce swing-in">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 px-3 py-1 text-blue-800 hover:text-pink-500 transition"
        ><ArrowLeft className="w-5 h-5" />Back Home</button>
        <span className="inline-block bg-gradient-to-r from-blue-600 to-pink-400 text-white px-4 py-2 rounded-2xl shadow-md text-xl font-extrabold tracking-tight drop-shadow-lg">
          JanConnect
        </span>
        <div className="w-12" /> {/* spacer */}
      </header>
      <main className="flex flex-1 items-center justify-center w-full animate-stagger">
        <div className="max-w-lg w-full crazy-bounce">
          <ReportProblem />
        </div>
      </main>
    </div>
  );
}
