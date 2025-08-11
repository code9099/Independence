import React, { useState, useEffect } from "react";
import LeaderboardShowcase from "@/components/LeaderboardShowcase";
import ConstituencySelector from "@/components/ConstituencySelector";
import MLAInfoCard from "@/components/MLAInfoCard";
import { useConstituencies } from "@/hooks/useConstituencies";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";

const LeaderboardPage = () => {
  const [selectedConId, setSelectedConId] = useState<string | null>(null);

  // Allow reloading after a constituency is added
  const { data: constituencies } = useConstituencies();

  const selectedCon = constituencies?.find((c: any) => String(c.id) === String(selectedConId));

  useEffect(() => {
    document.title = "Leaderboard - JanConnect Professional Civic Solutions";
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <PageHeader
          title="Constituency Leaderboard"
          subtitle="Compare performance and track representatives"
          action={(
            <Button asChild>
              <Link to="/heatmap">See Map</Link>
            </Button>
          )}
        />

        <section className="bg-card rounded-2xl border border-border shadow-sm p-6">
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
        </section>

        <section>
          <LeaderboardShowcase />
        </section>
      </div>
    </main>
  );
};

export default LeaderboardPage;
