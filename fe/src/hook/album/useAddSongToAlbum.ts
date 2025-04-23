import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

interface AddSongToAlbumBody {
  songIds: string[];
  albumId: string;
}

export const useAddSongToAlbum = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async (body: AddSongToAlbumBody) => {
      const res = await api.post(
        `${appUrls.backendUrl}/album/${body.albumId}/songs`,
        { songIds: body.songIds },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.data;
    },
  });
}; 