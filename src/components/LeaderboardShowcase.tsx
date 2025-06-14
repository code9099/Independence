
import { Trophy, Award, Medal, Star } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Meera P.",
    points: 85,
    avatar: "https://i.pravatar.cc/100?u=meera",
    badge: <Trophy className="text-yellow-400 w-8 h-8 drop-shadow" />,
  },
  {
    id: 2,
    name: "Rohan S.",
    points: 70,
    avatar: "https://i.pravatar.cc/100?u=rohan",
    badge: <Award className="text-sky-400 w-7 h-7 drop-shadow" />,
  },
  {
    id: 3,
    name: "Sana F.",
    points: 53,
    avatar: "https://i.pravatar.cc/100?u=sana",
    badge: <Medal className="text-rose-400 w-7 h-7 drop-shadow" />,
  },
  {
    id: 4,
    name: "Neha J.",
    points: 41,
    avatar: "https://i.pravatar.cc/100?u=neha",
    badge: <Star className="text-white/70 w-7 h-7 drop-shadow" />,
  },
  {
    id: 5,
    name: "Amit A.",
    points: 32,
    avatar: "https://i.pravatar.cc/100?u=amit",
    badge: <Star className="text-white/50 w-7 h-7 drop-shadow" />,
  },
  {
    id: 6,
    name: "Tara K.",
    points: 28,
    avatar: "https://i.pravatar.cc/100?u=tara",
    badge: <Star className="text-white/30 w-7 h-7 drop-shadow" />,
  },
];

const LeaderboardShowcase = () => (
  <section className="w-full flex flex-col items-center gap-8 relative z-10">
    {/* Top 1 - Featured Card */}
    <div className="relative bg-gradient-to-tr from-fuchsia-700 via-blue-700 to-pink-700 border-4 border-yellow-400 rounded-3xl shadow-2xl flex flex-col items-center px-8 py-10 mb-4 ring-4 ring-yellow-300/20 max-w-xl animate-enter scale-105">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <Trophy className="w-14 h-14 text-yellow-400 drop-shadow-xl animate-bounce" />
      </div>
      <img
        src={users[0].avatar}
        alt={users[0].name}
        className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-xl mb-2 object-cover"
        style={{ background: "#fff" }}
      />
      <div className="flex flex-col items-center mt-3">
        <span className="text-3xl font-extrabold text-yellow-200 drop-shadow-md">{users[0].name}</span>
        <span className="text-lg text-white/90 font-semibold">Champion</span>
      </div>
      <div className="flex gap-1 items-center mt-4">
        <span className="bg-yellow-500/80 text-yellow-900 px-4 py-1 text-xl font-bold rounded-full shadow">{users[0].points} pts</span>
      </div>
    </div>
    {/* Top 2-6 - Ranked List */}
    <ul className="w-full flex flex-col gap-3 items-center px-2">
      {users.slice(1).map((user, i) => (
        <li
          key={user.id}
          className={`
            w-full sm:w-96 flex items-center justify-between px-6 py-4 rounded-2xl
            bg-gradient-to-r ${i % 2 === 0
              ? "from-pink-400/70 via-pink-700/80 to-purple-700/80"
              : "from-blue-500/60 via-fuchsia-700/50 to-pink-800/90"}
            border border-white/10 shadow-2xl transition-transform hover:scale-105 animate-fade-in
          `}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 relative">
              <img
                src={user.avatar}
                className="w-12 h-12 rounded-full border-2 border-white shadow object-cover"
                alt={user.name}
                style={{ background: "#fff" }}
              />
              <span className="absolute -top-3 -left-3 bg-black/70 rounded-full p-1">
                {user.badge}
              </span>
            </div>
            <span className="font-bold text-lg text-white">{user.name}</span>
          </div>
          <span className="bg-white/10 text-pink-100 px-4 py-1 rounded-full text-base font-semibold">
            {user.points} pts
          </span>
        </li>
      ))}
    </ul>
    {/* Call to Action */}
    <div className="mt-8 flex flex-col items-center">
      <p className="text-white/80 font-semibold mb-2 text-lg flex items-center gap-2">
        <Star className="inline-block text-yellow-300 animate-spin" /> Up for the challenge?
      </p>
      <a
        href="/"
        className="bg-gradient-to-r from-yellow-400 via-pink-600 to-purple-800 text-white font-bold px-6 py-3 rounded-full shadow hover:scale-105 hover:shadow-2xl transition duration-200 animate-fade-in"
      >
        Start Reporting Problems Now
      </a>
    </div>
  </section>
);

export default LeaderboardShowcase;
