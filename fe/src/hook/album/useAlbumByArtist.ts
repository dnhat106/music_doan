import { useQuery } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";
import { Album } from "./useAllAlbums";

export const useAlbumByArtist = (artistId: string) => {
  const accessToken = useAccessToken();
  return useQuery<Album[]>({
    queryKey: ["albums", artistId],
    queryFn: () =>
      api
        .get(`${appUrls.backendUrl}/album/artist/${artistId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response.data.data),
    enabled: !!accessToken,
  });
};
