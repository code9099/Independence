
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onAdded: () => void;
}

const AddConstituencyForm: React.FC<Props> = ({ onAdded }) => {
  const [name, setName] = useState("");
  const [mla_name, setMlaName] = useState("");
  const [mla_party, setMlaParty] = useState("");
  const [mla_phone, setMlaPhone] = useState("");
  const [mla_email, setMlaEmail] = useState("");
  const [mla_photo_url, setMlaPhotoUrl] = useState("");
  const [office_address, setOfficeAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.from("constituencies").insert([
      {
        name,
        mla_name,
        mla_party,
        mla_phone,
        mla_email,
        mla_photo_url,
        office_address,
      },
    ]);
    setSaving(false);

    if (error) setError(error.message);
    else {
      setSuccess(true);
      setName("");
      setMlaName("");
      setMlaParty("");
      setMlaPhone("");
      setMlaEmail("");
      setMlaPhotoUrl("");
      setOfficeAddress("");
      onAdded();
      setTimeout(() => setSuccess(false), 2000);
    }
  }

  return (
    <form
      className="bg-blue-50/80 rounded-xl border border-blue-100 px-6 py-5 mb-6 flex flex-col gap-2"
      onSubmit={handleSubmit}
      style={{ maxWidth: 600 }}
    >
      <div className="font-bold text-blue-800 mb-1 text-md">Add Constituency</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          placeholder="Constituency Name *"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <Input
          placeholder="MLA Name"
          value={mla_name}
          onChange={e => setMlaName(e.target.value)}
        />
        <Input
          placeholder="MLA Party"
          value={mla_party}
          onChange={e => setMlaParty(e.target.value)}
        />
        <Input
          placeholder="MLA Phone"
          value={mla_phone}
          onChange={e => setMlaPhone(e.target.value)}
        />
        <Input
          placeholder="MLA Email"
          value={mla_email}
          onChange={e => setMlaEmail(e.target.value)}
        />
        <Input
          placeholder="MLA Photo URL"
          value={mla_photo_url}
          onChange={e => setMlaPhotoUrl(e.target.value)}
        />
      </div>
      <Textarea
        placeholder="Office Address"
        value={office_address}
        onChange={e => setOfficeAddress(e.target.value)}
      />
      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={saving || !name}>
          {saving ? "Saving..." : "Add"}
        </Button>
        {success && <span className="text-green-700 px-2">Constituency added!</span>}
        {error && <span className="text-red-600 px-2">{error}</span>}
      </div>
    </form>
  );
};

export default AddConstituencyForm;
