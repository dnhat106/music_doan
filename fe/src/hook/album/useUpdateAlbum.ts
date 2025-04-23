import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";
import { IAlbumDTO } from "./useCreateAlbum";

export const useUpdateAlbum = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: IAlbumDTO }) => {
      const res = await api.put(
        `${appUrls.backendUrl}/album/${id}`,
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