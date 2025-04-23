import { useQuery } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { Song } from "./useAllSongs";
import { useAccessToken } from "../auth/useUserInfo";

interface History {
  _id: string;
  createdAt: string;
  song: Song;
}

export const useMyHistory = () => {
  const accessToken = useAccessToken();
  return useQuery<History[]>({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await api.get(`${appUrls.backendUrl}/song/history`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data.data;
    },
    enabled: !!accessToken,
  });
};
