//useMutation la hook tu react query de thuc hien them song vao playlist
import { useMutation } from "@tanstack/react-query";
//goi api de them song vao playlist
import api from "../../apis/axiosCustom";
//lay url backend
import { appUrls } from "../../apis/contants";
//lay access token nguoi dung
import { useAccessToken } from "../auth/useUserInfo";
interface AddSongToPlaylistBody {
  songId: string;
  playlistId: string;
}
export const useAddSongToPlaylist = () => {
  const accessToken = useAccessToken();
  //useMutation la hook tu react query de thuc hien them song vao playlist
  return useMutation({
    //ham goi mutate trong componentscomponents
    mutationFn: async (body: AddSongToPlaylistBody) => {
      //goi api de them song vao playlist
      const res = await api.post(
        `${appUrls.backendUrl}/playlist/${body.playlistId}/toggle-song/${body.songId}`, {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //tra ve du lieu tu api
      return res.data;
    },
  });
};
