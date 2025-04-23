import { useQuery } from "@tanstack/react-query";
import { useAccessToken } from "../auth/useUserInfo";
import { Artist } from "./useAllArtists";
import { appUrls } from "../../apis/contants";
import api from "../../apis/axiosCustom";

export const useArtistDetail = (artistId: string) => {
  const accessToken = useAccessToken();
  return useQuery<Artist>({
    queryKey: ["artist", artistId],
    queryFn: () =>
      api
        .get(`${appUrls.backendUrl}/artist/${artistId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => response.data.data),
  });
};
