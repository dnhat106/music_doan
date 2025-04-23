import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

export const useCreatePlaylist = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async (body: any) => {
      const res = await api.post(
        `${appUrls.backendUrl}/playlist`, body,
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
