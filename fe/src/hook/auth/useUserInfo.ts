import { useQuery } from "@tanstack/react-query";
import { User } from "../../apis/auth.api";
import { appUrls } from "../../apis/contants";
import api from "../../apis/axiosCustom";

export function useUserInfo() {
  const accessToken = useAccessToken();
  return useQuery<User>({
    queryKey: ["my-info"],
    queryFn: () =>
      api
        .get(`${appUrls.backendUrl}/auth/my-info`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          return response.data.data
        }),
    enabled: !!accessToken,
  });
}

export const useAccessToken = () => {
  const accessToken = localStorage.getItem("token");
  return accessToken;
};
export const useIsLogin = () => {
  const accessToken = localStorage.getItem("token");
  return !!accessToken;
};
