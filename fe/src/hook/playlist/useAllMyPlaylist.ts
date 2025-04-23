import { useQuery } from "@tanstack/react-query";
import { useAccessToken } from "../auth/useUserInfo";
import api from "../../apis/axiosCustom";
import { appUrls } from "../../apis/contants";
//dinh nghia kieu du lieu song (bai hat trong playlist)
import { Song } from "../song/useAllSongs";
//dinh nghia interface playlist
export interface Playlist {
  _id: string;
  name: string;
  description: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
}
//hook lay danh sach playlist cua user
export function useAllMyPlaylists() {
  const accessToken = useAccessToken();//lay access token nguoi dung
//useQuery la hook tu react query de goi du lieu tu api
  return useQuery<Playlist[]>({
    queryKey: ["playlists"],
   //Đây là hàm chính để fetch 
   // dữ liệu. Nó gọi API /playlist/me từ server, 
   // kèm theo accessToken trong headers để xác thực người dùng.
    queryFn: () =>
      api
        .get(`${appUrls.backendUrl}/playlist/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => response.data.data),
        //tranh goi api khi chua dang nhap
    enabled: !!accessToken,
  });
}
