
import React from "react";
import CivicHeatmap from "@/components/CivicHeatmap";
import { Link } from "react-router-dom";
import { Map } from "lucide-react";

const HeatmapPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-900 via-fuchsia-900 to-pink-900 flex flex-col items-center pt-10 pb-20">
    <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-xl p-4 md:p-8 mb-8 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-3">
        <Map className="text-blue-700" size={30} />
        <h1 className="font-extrabold text-2xl text-blue-800">Delhi Civic Heatmap</h1>
      </div>
      <div className="mb-2 text-gray-700 text-sm">
        Explore Delhi's live civic complaint density by constituency. Zoom, click, and hover to get data for each area.
      </div>
      <CivicHeatmap />
      <div className="flex justify-end mt-3">
        <Link to="/leaderboard">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-pink-500 font-medium transition">
            Back to Leaderboard
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default HeatmapPage;
