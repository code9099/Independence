
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useConstituencies() {
  return useQuery({
    queryKey: ["constituencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("constituencies")
        .select("id, name, mla_name, mla_party, mla_photo_url, mla_phone, mla_email, office_address");
      if (error) throw error;
      return data || [];
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("id, name, description, website");
      if (error) throw error;
      return data || [];
    },
  });
}
