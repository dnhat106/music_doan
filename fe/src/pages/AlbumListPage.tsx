import React from "react";
import { Card, Row, Col, Typography, Image, Space } from "antd";
import { useAllAlbums } from "../hook/album/useAllAlbums";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Spin } from "antd";

const { Title, Text } = Typography;

const AlbumListContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 100px;
`;

const StyledCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }

  .ant-card-cover {
    padding: 16px;
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const AlbumImage = styled(Image)`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
`;

const AlbumTitle = styled(Title)`
  margin: 0 !important;
  font-size: 16px !important;
  color: #000 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 230px;
`;

const ArtistName = styled(Text)`
  color: #666;
  font-size: 14px;
`;

const AlbumListPage: React.FC = () => {
  const { data: albums, isLoading } = useAllAlbums();
  const navigate = useNavigate();

  if (isLoading) {
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

  return (
    <AlbumListContainer>
      <Title level={2} style={{ marginBottom: 24 }}>
        Albums
      </Title>
      <Row gutter={[24, 24]}>
        {albums?.map((album) => (
          <Col xs={24} sm={12} md={8} lg={6} key={album._id}>
            <StyledCard
              hoverable
              onClick={() => navigate(`/album/${album._id}`)}
              cover={
                <AlbumImage
                  src={album.coverAt}
                  alt={album.title}
                  fallback="https://via.placeholder.com/300x300?text=No+Image"
                />
              }
            >
              <Space direction="vertical" size={4}>
                <AlbumTitle level={5} ellipsis={{ rows: 1 }}>
                  {album.title}
                </AlbumTitle>
                <ArtistName>{album.artist.name}</ArtistName>
                <Text type="secondary">
                  {new Date(album.releaseDate).toLocaleDateString()}
                </Text>
                <Text type="secondary">{album.songs?.length || 0} songs</Text>
              </Space>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </AlbumListContainer>
  );
};

export default AlbumListPage;
