import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

export const useUpdateGenre = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const res = await api.put(
        `${appUrls.backendUrl}/genre/${id}`,
        body,
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