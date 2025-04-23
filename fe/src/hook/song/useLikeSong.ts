import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "../auth/useUserInfo";

export function useLikeSong() {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (songId: string) => {
      return api.post(
        `${appUrls.backendUrl}/song/favorite/${songId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
  });
}
