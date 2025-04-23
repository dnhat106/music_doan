import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";
import { IArtistDTO } from "./useCreateArtist";

export const useUpdateArtist = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: IArtistDTO }) => {
      const res = await api.put(
        `${appUrls.backendUrl}/artist/${id}`,
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