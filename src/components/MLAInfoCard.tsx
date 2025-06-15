
import React from "react";

interface MLAInfoCardProps {
  mla_name?: string;
  mla_party?: string;
  mla_photo_url?: string;
  mla_phone?: string;
  mla_email?: string;
  office_address?: string;
  mla_gender?: "male" | "female";
}

const guessGender = (name?: string) => {
  // Very basic guess, could be improved
  if (!name) return null;
  const lowercase = name.toLowerCase();
  if (
    lowercase.includes("rekha") ||
    lowercase.includes("meera") ||
    lowercase.includes("nisha") ||
    lowercase.includes("neha") ||
    lowercase.includes("sunita") ||
    lowercase.includes("kavita") ||
    lowercase.includes("anita") ||
    lowercase.includes("sapna") ||
    lowercase.includes("poonam") ||
    lowercase.includes("raj bala")
  ) {
    return "female";
  }
  return "male";
};

const MLAInfoCard: React.FC<MLAInfoCardProps> = ({
  mla_name,
  mla_party,
  mla_photo_url,
  mla_phone,
  mla_email,
  office_address,
}) => {
  if (!mla_name) return null;

  const gender = guessGender(mla_name);
  const label =
    gender === "female"
      ? "She is the MLA"
      : "He is the MLA";

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-4 shadow">
      {mla_photo_url ? (
        <img src={mla_photo_url} alt={mla_name} className="w-16 h-16 rounded-full border object-cover bg-white" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
          👤
        </div>
      )}
      <div>
        <div className="font-bold text-blue-800 text-lg flex items-center gap-2">
          {mla_name}
          <span className="bg-pink-100 text-pink-700 ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border border-pink-300">MLA</span>
        </div>
        <div className="text-blue-600 text-sm">{mla_party}</div>
        <div className="text-xs text-gray-600 mb-1">{label}</div>
        {mla_email && <div className="text-xs text-gray-700">✉️ {mla_email}</div>}
        {mla_phone && <div className="text-xs text-gray-700">📞 {mla_phone}</div>}
        {office_address && <div className="text-xs text-gray-500 mt-1">🏛️ {office_address}</div>}
      </div>
    </div>
  );
};

export default MLAInfoCard;

