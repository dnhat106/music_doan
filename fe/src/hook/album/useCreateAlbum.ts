import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

export interface IAlbumDTO {
  title: string;
  artist: string;
  releaseDate: Date;
  coverImage: string;
  description: string;
}

export const useCreateAlbum = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async (body: IAlbumDTO) => {
      const res = await api.post(
        `${appUrls.backendUrl}/album`,
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