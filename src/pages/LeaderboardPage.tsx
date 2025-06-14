
import React, { useState } from "react";
import LeaderboardShowcase from "@/components/LeaderboardShowcase";
import ConstituencySelector from "@/components/ConstituencySelector";
import MLAInfoCard from "@/components/MLAInfoCard";
import { useConstituencies } from "@/hooks/useConstituencies";

const LeaderboardPage = () => {
  const [selectedConId, setSelectedConId] = useState<string | null>(null);
  const { data: constituencies } = useConstituencies();

  const selectedCon = constituencies?.find((c: any) => String(c.id) === String(selectedConId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-fuchsia-900 to-pink-900 pt-10 pb-20 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-xl p-8 mb-8">
        <h1 className="font-extrabold text-2xl mb-3 text-blue-800">Delhi Constituency Leaderboard</h1>
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
