
import LeaderboardShowcase from "@/components/LeaderboardShowcase";
import ReturnHomeButton from "@/components/ReturnHomeButton";

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-950 via-pink-900 to-purple-900 flex flex-col items-center relative overflow-x-hidden">
      <ReturnHomeButton />
      {/* Header */}
      <header className="w-full flex flex-col items-center py-8 mb-6 z-10">
        <h1 className="font-extrabold text-5xl md:text-6xl text-white tracking-tight drop-shadow-[0_2px_16px_rgba(255,0,128,0.4)] animate-fade-in">
          🌟 Community Leaderboard
        </h1>
        <p className="mt-3 text-lg md:text-2xl text-pink-100 font-medium leading-relaxed text-center drop-shadow">
          Celebrate top contributors! <span className="text-yellow-300">Climb the ranks, earn rewards, inspire others.</span>
        </p>
        {/* Back to Home button removed in favor of floating cute button */}
      </header>
      {/* Main Content */}
      <main className="w-full max-w-3xl flex flex-col items-center gap-8 px-4 pb-16">
        <LeaderboardShowcase />
        <div className="text-center text-white/70 mt-10 animate-fade-in">
          <p className="font-medium mb-1">🔔 Want to appear here? Start reporting civic issues and engaging with your community threads!</p>
          <p className="opacity-80 text-xs">* Rankings reset monthly. Next reset: <span className="font-bold text-pink-300">{new Date(new Date().setMonth(new Date().getMonth()+1)).toLocaleString('default',{month:'long'})} 1st</span></p>
        </div>
      </main>
      {/* Animated "Netflix" gradient bar at bottom */}
      <div className="fixed bottom-0 left-0 w-full h-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse z-20" />
    </div>
  );
};

export default LeaderboardPage;
