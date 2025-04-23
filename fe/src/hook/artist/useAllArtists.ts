import { useQuery } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";
import { Genre } from "../genre/useAllGenres";

export interface Artist {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  genre: Genre;
}

export const useAllArtists = () => {
  const accessToken = useAccessToken();
  return useQuery<Artist[]>({
    queryKey: ["artists"],
    queryFn: () =>
      api
        .get(`${appUrls.backendUrl}/artist`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response.data.data),
  });
}; 