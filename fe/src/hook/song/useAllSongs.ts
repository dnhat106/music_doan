import { useQuery } from "@tanstack/react-query";
import { useAccessToken } from "../auth/useUserInfo";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { Genre } from "../genre/useAllGenres";

export interface Song {
  _id: string;
  title: string;
  genre: Genre;
  lyric: string;
  playCount: number;
  duration: string;
  releaseDate: Date;
  secureUrl: string;
  admin: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useAllSongs() {
  const accessToken = useAccessToken();
  
  return useQuery<Song[]>({
    queryKey: ["songs"],
    queryFn: () =>
      api
        .get(`${appUrls.backendUrl}/song`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response.data.data),
  });
}
