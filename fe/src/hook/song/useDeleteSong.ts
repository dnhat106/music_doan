import { useMutation } from "@tanstack/react-query";
import { appUrls } from "../../apis/contants";
import api from "../../apis/axiosCustom";
import { useAccessToken } from "../auth/useUserInfo";

export const useDeleteSong = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: (songId: string) =>
      api.delete(`${appUrls.backendUrl}/song/${songId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
  });
};
