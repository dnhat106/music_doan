import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

export const useDeletePlaylist = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async (playlistId: string) => {
      const res = await api.delete(
        `${appUrls.backendUrl}/playlist/${playlistId}`,
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
