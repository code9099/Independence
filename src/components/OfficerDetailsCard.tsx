
import React from "react";
import { useOfficers } from "@/hooks/useOfficers";
import { Loader2, Mail, Phone } from "lucide-react";

interface OfficerDetailsCardProps {
  constituency: string;
}

const OfficerDetailsCard: React.FC<OfficerDetailsCardProps> = ({ constituency }) => {
  const { data, isLoading, error } = useOfficers(constituency);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 text-blue-700 justify-center">
        <Loader2 className="animate-spin" /> Loading officer details...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-700 p-4">
        Failed to load officer details.
      </div>
    );
  }

  const { mla, officers = [] } = data;

  return (
    <div className="bg-white/90 border border-blue-200 rounded-2xl p-5 mb-6 shadow-md animate-fade-in max-w-2xl mx-auto">
      <h3 className="font-bold text-lg mb-2 text-blue-900 flex items-center gap-2">Your Area Representatives</h3>
      {mla && (
        <div className="mb-4 flex items-center gap-4">
          <img
            src={mla.photo_url || "/placeholder.svg"}
            alt={mla.name}
            className="w-16 h-16 rounded-full shadow border object-cover"
          />
          <div>
            <div className="text-base font-semibold">{mla.name} <span className="ml-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{mla.party}</span></div>
            <div className="text-sm text-gray-500">{mla.designation}</div>
            <div className="flex gap-3 mt-1 text-xs items-center">
              {mla.email && (
                <a href={`mailto:${mla.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                  <Mail size={16} /> {mla.email}
                </a>
              )}
              {mla.phone && (
                <a href={`tel:${mla.phone}`} className="flex items-center gap-1 text-pink-600 hover:underline">
                  <Phone size={16} /> {mla.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      <div>
        <h4 className="font-semibold mb-2 text-blue-800">Key Officers:</h4>
        {officers.length === 0 ? (
          <div className="text-gray-500">No officers found for this area.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {officers.map((officer: any) => (
              <div key={officer.id} className="border bg-blue-50/70 rounded-xl p-3 flex flex-col gap-0.5 shadow">
                <div className="font-bold">{officer.name}</div>
                <div className="font-medium text-sm">{officer.designation}</div>
                <div className="text-xs">Dept: <b>{officer.department?.name || "—"}</b></div>
                <div className="flex gap-2 mt-1 text-xs">
                  {officer.email && (
                    <a href={`mailto:${officer.email}`} className="flex items-center gap-1 text-blue-700 hover:underline">
                      <Mail size={14} /> {officer.email}
                    </a>
                  )}
                  {officer.mobile && (
                    <a href={`tel:${officer.mobile}`} className="flex items-center gap-1 text-pink-700 hover:underline">
                      <Phone size={14} /> {officer.mobile}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDetailsCard;
