
import React, { useState, useRef } from "react";
import { Check } from "lucide-react";
import confetti from "canvas-confetti";

const users = [
  {
    id: 1, name: "Meera P.", points: 85, avatar: "https://i.pravatar.cc/42?u=meera"
  },
  {
    id: 2, name: "Rohan S.", points: 70, avatar: "https://i.pravatar.cc/42?u=rohan"
  },
  {
    id: 3, name: "Sana F.", points: 53, avatar: "https://i.pravatar.cc/42?u=sana"
  },
];

function fireConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    startVelocity: 25,
    ticks: 90,
    gravity: 0.7
  });
}

const Leaderboard: React.FC = () => {
  const [milestoneHit, setMilestoneHit] = useState(false);

  const onConfetti = () => {
    fireConfetti();
    setMilestoneHit(true);
    setTimeout(() => setMilestoneHit(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-muted xl:rounded-3xl rounded-xl px-5 py-8 border shadow-xl flex flex-col gap-2 animate-fade-in transition-all">
      <h3 className="font-medium text-lg text-blue-800 flex items-center gap-2 mb-4">
        🏆 Leaderboard
      </h3>
      <ol className="flex flex-col gap-2">
        {users.map((user, i) => (
          <li key={user.id} className="flex items-center gap-3 px-2 py-1 rounded-lg transition-all group">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border" />
            <span className="font-semibold">{user.name}</span>
            <span className="ml-auto font-bold text-blue-700 text-md">{user.points} pts</span>
            {i === 0 && (
              <button
                className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs ml-2 font-medium shadow hover:bg-green-200 focus:outline-none transition duration-200"
                onClick={onConfetti}
                aria-label="Celebrate Milestone"
              >
                <Check className="w-4 h-4 inline" /> Milestone!
              </button>
            )}
          </li>
        ))}
      </ol>
      <div className="text-xs text-gray-400 pt-3">
        Report & help your area, climb higher!
      </div>
      {milestoneHit && (
        <div className="fixed left-1/2 top-1/2 z-50 animate-fade-in -translate-x-1/2 -translate-y-1/2 font-bold text-green-600 bg-white px-6 py-3 rounded-2xl shadow-lg border border-green-100">
          🎉 Achievement Unlocked!
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
