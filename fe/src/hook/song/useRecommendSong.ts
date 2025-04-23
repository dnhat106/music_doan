import { useQuery } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { useAccessToken } from "../auth/useUserInfo";
import { Song } from "./useAllSongs";
import { appUrls } from "../../apis/contants";

export interface RecommendSong {
  _id: string;
  title: string;
  songs: Song[];
  recommendDate: Date;
}

export const useRecommendSong = () => {
  const accessToken = useAccessToken();
  return useQuery<RecommendSong[]>({
    queryKey: ["recommend-song"],
    queryFn: async () => {
      const res = await api.get(`${appUrls.backendUrl}/song/recommend`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data.data;
    },
    enabled: !!accessToken,
  });
};

