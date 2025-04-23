import React from 'react';
import { useParams } from 'react-router-dom';
import { useAllAlbums } from '../hook/album/useAllAlbums';
import { Typography, Image, List, Space, Spin, Row, Col } from 'antd';
import styled from 'styled-components';
import { PlayCircleOutlined, CalendarOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { Song } from '../hook/song/useAllSongs';

const { Title, Text } = Typography;

const AlbumDetailContainer = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  background-color: transparent;
  padding-bottom: 100px;
`;

const AlbumHeader = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
`;

const AlbumInfo = styled.div`
  flex: 1;
`;

const AlbumCover = styled(Image)`
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

const SongList = styled(List)`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .ant-list-item {
    padding: 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    margin-bottom: 8px;

    &:hover {
      background-color: #f5f5f5;
      transform: translateX(4px);
    }
  }
`;

const PlayIcon = styled(PlayCircleOutlined)`
  font-size: 24px;
  color: #ffb30e;
  margin-right: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const IconWrapper = styled.span`
  color: #ffb30e;
  font-size: 16px;
`;

const AlbumDetailPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { data: albums, isLoading } = useAllAlbums();

  if (isLoading || !albums) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const album = albums?.find(album => album._id === albumId);

  if (!album) {
    return (
      <AlbumDetailContainer>
        <Title level={2}>Album not found</Title>
      </AlbumDetailContainer>
    );
  }
  
  return (
    <AlbumDetailContainer>
      <AlbumHeader>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} md={8}>
            <AlbumCover
              src={album.coverAt}
              alt={album.title}
              fallback="https://via.placeholder.com/300x300?text=No+Image"
            />
          </Col>
          <Col xs={24} sm={24} md={16}>
            <AlbumInfo>
              <Title level={2} style={{ marginBottom: 24 }}>{album.title}</Title>
              <Space direction="vertical" size={16}>
                <InfoItem>
                  <IconWrapper><UserOutlined /></IconWrapper>
                  <Text strong style={{ fontSize: 16 }}>{album.artist.name}</Text>
                </InfoItem>
                <InfoItem>
                  <IconWrapper><CalendarOutlined /></IconWrapper>
                  <Text style={{ fontSize: 16 }}>
                    Release Date: {new Date(album.releaseDate).toLocaleDateString()}
                  </Text>
                </InfoItem>
                <InfoItem>
                  <IconWrapper><CustomerServiceOutlined /></IconWrapper>
                  <Text style={{ fontSize: 16 }}>
                    {album.songs?.length || 0} songs
                  </Text>
                </InfoItem>
              </Space>
            </AlbumInfo>
          </Col>
        </Row>
      </AlbumHeader>

      <Title level={3} style={{ marginBottom: 16 }}>Track List</Title>
      <SongList
        dataSource={album.songs}
        renderItem={(song) => (
          <List.Item>
            <Space>
              <PlayIcon />
              <div>
                <Text strong style={{ fontSize: 16 }}>{(song as Song).title}</Text>
                <br />
                <Text type="secondary">{(song as Song).genre.name}</Text>
              </div>
            </Space>
          </List.Item>
        )}
      />
    </AlbumDetailContainer>
  );
};

export default AlbumDetailPage; 