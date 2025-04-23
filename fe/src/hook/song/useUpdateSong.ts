import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { Song } from "./useAllSongs";
import { useAccessToken } from "../auth/useUserInfo";

interface UpdateSongPayload {
  data: Song;
  songId: string;
}

export function useUpdateSong() {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: ({ data, songId }: UpdateSongPayload) => {
      return api.put(`${appUrls.backendUrl}/song/${songId}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
  });
}
