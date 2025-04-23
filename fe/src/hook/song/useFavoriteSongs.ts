import { useUserInfo } from "../auth/useUserInfo";

export function useFavoriteSongs() {
  const { data: userInfo, isLoading, isError } = useUserInfo();

  return {
    data: userInfo?.favoriteSongs ?? [],
    isLoading,
    isError,
  };
}