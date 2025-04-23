import React from "react";
import { useParams } from "react-router-dom";
import { useAllSongs } from "../hook/song/useAllSongs";
import { useAllAlbums } from "../hook/album/useAllAlbums";
import { Typography, Image, Space, Spin, Row, Col, Button } from "antd";
import styled from "styled-components";
import {
  PlayCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAudioPlayer } from "../context/AudioPlayerContext";

const { Title, Text } = Typography;

const SongDetailContainer = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  background-color: transparent;
  padding-bottom: 100px;
`;

const SongHeader = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
`;

const SongCover = styled(Image)`
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  font-size: 16px;
  border-radius: 20px;
  padding: 0 24px;
`;

const PlayButton = styled(ActionButton)`
  background-color: #ffb30e;
  border-color: #ffb30e;
  color: white;

  &:hover {
    background-color: #ffa000 !important;
    border-color: #ffa000 !important;
    color: white !important;
  }
`;

const AlbumLink = styled(Text)`
  color: #ffb30e;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SongDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { songId } = useParams<{ songId: string }>();
  const { data: songs, isLoading: isLoadingSongs } = useAllSongs();
  const { data: albums, isLoading: isLoadingAlbums } = useAllAlbums();
  const { playTrack } = useAudioPlayer();

  if (isLoadingSongs || isLoadingAlbums || !songs || !albums) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const song = songs?.find((song) => song._id === songId);

  if (!song) {
    return (
      <SongDetailContainer>
        <Title level={2}>Song not found</Title>
      </SongDetailContainer>
    );
  }

  const album = albums.find((album) =>
    album.songs?.some((s) => s._id === songId)
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleAlbumClick = () => {
    if (album) {
      navigate(`/album/${album._id}`);
    }
  };

  return (
    <SongDetailContainer>
      <Button type="text" onClick={handleBack} style={{ marginBottom: 16 }}>
        ← Back
      </Button>

      <SongHeader>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} md={8}>
            <SongCover
              src={song.thumbnail}
              alt={song.title}
              fallback="https://via.placeholder.com/300x300?text=No+Image"
            />
          </Col>
          <Col xs={24} sm={24} md={16}>
            <Space direction="vertical" size={24}>
              <div>
                <Title level={2} style={{ marginBottom: 8 }}>
                  {song.title}
                </Title>
                <Text strong style={{ fontSize: 18 }}>
                  {"Chưa lấy artist"}
                </Text>
              </div>

              <Space direction="vertical" size={8}>
                <Text type="secondary">Genre: {song.genre?.name}</Text>
                {album && (
                  <Text type="secondary">
                    Album:{" "}
                    <AlbumLink onClick={handleAlbumClick}>
                      {album.title}
                    </AlbumLink>
                  </Text>
                )}
                <Text type="secondary">
                  Release Date:{" "}
                  {new Date(song.releaseDate).toLocaleDateString()}
                </Text>
              </Space>

              <Space size={16}>
                <PlayButton onClick={() => playTrack(song)} type="primary" icon={<PlayCircleOutlined />}>
                  Play Now
                </PlayButton>
                <ActionButton icon={<HeartOutlined />}>Like</ActionButton>
                <ActionButton icon={<ShareAltOutlined />}>Share</ActionButton>
                <ActionButton icon={<DownloadOutlined />}>
                  Download
                </ActionButton>
              </Space>
            </Space>
          </Col>
        </Row>
      </SongHeader>
    </SongDetailContainer>
  );
};

export default SongDetailPage;
