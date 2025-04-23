// create use Update User
import { useMutation } from "@tanstack/react-query";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
import { useAccessToken } from "./useUserInfo";

interface UpdateUserPayload {
  username?: string;
  phone?: string;
}

export const useUpdateUser = () => {
  const accessToken = useAccessToken();
  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const response = await api.put(
        `${appUrls.backendUrl}/auth/my-info`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};
