
import { useMutation } from "@tanstack/react-query";
import { appUrls } from "../../apis/contants";
import api from "../../apis/axiosCustom";
import { useAccessToken } from "../auth/useUserInfo";

export const useCountPlaySong = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: (songId: string) =>
      api.get(`${appUrls.backendUrl}/song/play/${songId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
  });
};
