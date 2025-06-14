
import React from "react";

interface MLAInfoCardProps {
  mla_name?: string;
  mla_party?: string;
  mla_photo_url?: string;
  mla_phone?: string;
  mla_email?: string;
  office_address?: string;
}

const MLAInfoCard: React.FC<MLAInfoCardProps> = ({
  mla_name,
  mla_party,
  mla_photo_url,
  mla_phone,
  mla_email,
  office_address,
}) => {
  if (!mla_name) return null;
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4 shadow">
      {mla_photo_url ? (
        <img src={mla_photo_url} alt={mla_name} className="w-16 h-16 rounded-full border" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">👤</div>
      )}
      <div>
        <div className="font-bold text-blue-800 text-lg">{mla_name}</div>
        <div className="text-blue-600 text-sm">{mla_party}</div>
        {mla_email && <div className="text-xs text-gray-700">✉️ {mla_email}</div>}
        {mla_phone && <div className="text-xs text-gray-700">📞 {mla_phone}</div>}
        {office_address && <div className="text-xs text-gray-500 mt-1">🏛️ {office_address}</div>}
      </div>
    </div>
  );
};

export default MLAInfoCard;
