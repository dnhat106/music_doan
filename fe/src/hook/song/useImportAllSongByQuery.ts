import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

export const useImportAllSongByQuery = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async (query: string) => {
      const res = await api.post(
        `${appUrls.backendUrl}/song/import`,
        { query },
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
