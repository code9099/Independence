
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useOfficers(constituency?: string) {
  return useQuery({
    queryKey: ["officers", constituency],
    queryFn: async () => {
      let url = "/api/officers";
      if (constituency) url += `?constituency=${encodeURIComponent(constituency)}`;
      const { data } = await axios.get(url);
      return data;
    },
  });
}
