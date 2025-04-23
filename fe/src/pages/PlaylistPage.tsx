import { useParams } from "react-router-dom";
import { Empty, Layout, Spin } from "antd";
import styled from "styled-components";
import { SectionListMusic } from "../components/landing";
import { LibrarySider } from "../components/layout/sider";
import MusicPlayer from "../components/music/player";
import { useAllMyPlaylists } from "../hook/playlist/useAllMyPlaylist";

const { Content } = Layout;

const Wrapper = styled.div`
  background-color: rgba(240, 242, 245, 0.5);
  min-height: 90vh;
`;

const CustomLayout = styled(Layout)`
  background-color: transparent !important;
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const CustomContent = styled(Content)`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0px 24px 24px 24px;
  box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

export const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { data: playlists, isLoading } = useAllMyPlaylists();

  if (isLoading || !playlists) {
    return (
      <Wrapper>
        <Spin size="large" />
      </Wrapper>
    );
  }

  const playlist = playlists.find((p) => p._id === playlistId);

  if (!playlist) {
    return (
      <Wrapper>
        <Empty description="Playlist không tồn tại hoặc đã bị xóa" />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <CustomLayout>
        <LibrarySider />
        <CustomContent>
          <SectionListMusic playlistName={playlist.name} songs={playlist.songs} />
        </CustomContent>
      </CustomLayout>
      <MusicPlayer />
    </Wrapper>
  );
};
