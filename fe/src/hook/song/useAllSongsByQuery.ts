import { useQuery } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";

export interface SpotifyTrack {
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  album: {
    name: string;
    release_date: string;
    images: { url: string }[];
    external_urls: { spotify: string };
    artists: { name: string; external_urls: { spotify: string } }[];
  };
  artists: {
    name: string;
    external_urls: { spotify: string };
    id: string;
  }[];
  id: string;
}

export const useAllSongsByQuery = (query: string) => {
  return useQuery<SpotifyTrack[]>({
    queryKey: ["songs-spotify", query],
    queryFn: async () => {
      const res = await api.get(`${appUrls.backendUrl}/song/spotify`, {
        params: { query },
      });
      return res.data.data;
    },
    enabled: !!query,
  });
};
