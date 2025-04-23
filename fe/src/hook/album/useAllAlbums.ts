import { useQuery } from "@tanstack/react-query";
import { useAccessToken } from "../auth/useUserInfo";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { Artist } from "../artist/useAllArtists";
import { Song } from "../song/useAllSongs";

export interface Album {
  _id: string;
  title: string;
  artist: Artist;
  releaseDate: Date;
  coverAt: string;
  createdAt: Date;
  updatedAt: Date;
  songs?: Song[];
}

export const useAllAlbums = () => {
  const accessToken = useAccessToken();
  return useQuery({
    queryKey: ["albums"],
    queryFn: (): Promise<Album[]> =>
      api
        .get(`${appUrls.backendUrl}/album`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response.data.data),
  });
};
