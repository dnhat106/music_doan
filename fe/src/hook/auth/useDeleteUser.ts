import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

export const useDeleteUser = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(
        `${appUrls.backendUrl}/auth/user/${id}`,
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