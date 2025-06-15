import React, { useState } from "react";
import LeaderboardShowcase from "@/components/LeaderboardShowcase";
import ConstituencySelector from "@/components/ConstituencySelector";
import MLAInfoCard from "@/components/MLAInfoCard";
import { useConstituencies } from "@/hooks/useConstituencies";
import { Link } from "react-router-dom";

const LeaderboardPage = () => {
  const [selectedConId, setSelectedConId] = useState<string | null>(null);

  // Allow reloading after a constituency is added
  const { data: constituencies, refetch, isLoading } = useConstituencies();

  const selectedCon = constituencies?.find((c: any) => String(c.id) === String(selectedConId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-fuchsia-900 to-pink-900 pt-10 pb-20 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-xl p-8 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h1 className="font-extrabold text-2xl text-blue-800">Delhi Constituency Leaderboard</h1>
          <Link to="/heatmap">
            <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-md shadow hover:bg-pink-500 transition font-semibold">
              <span role="img" aria-label="map">🗺️</span>
              See Map
            </button>
          </Link>
        </div>
        <div className="mb-4">
          <ConstituencySelector value={selectedConId} onChange={setSelectedConId} />
        </div>
        {selectedCon && (
          <div className="mb-6">
            <MLAInfoCard
              mla_name={selectedCon.mla_name}
              mla_party={selectedCon.mla_party}
              mla_photo_url={selectedCon.mla_photo_url}
              mla_phone={selectedCon.mla_phone}
              mla_email={selectedCon.mla_email}
              office_address={selectedCon.office_address}
            />
          </div>
        )}
        {/* Here you could show constituency-wise contribution stats */}
      </div>
      <LeaderboardShowcase />
    </div>
  );
};

export default LeaderboardPage;
