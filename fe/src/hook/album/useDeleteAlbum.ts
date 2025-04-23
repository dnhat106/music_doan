import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

export const useDeleteAlbum = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(
        `${appUrls.backendUrl}/album/${id}`,
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