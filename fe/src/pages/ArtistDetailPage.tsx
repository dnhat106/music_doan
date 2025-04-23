import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useArtistDetail } from "../hook/artist/useArtistDetail";
import { useAlbumByArtist } from "../hook/album/useAlbumByArtist";
import { Typography, Spin, Row, Col, Card, Avatar, Tag, Empty } from "antd";
import styled from "styled-components";

const { Title, Paragraph } = Typography;

const Container = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ArtistHeader = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 40px;
`;

const ArtistAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
`;

const AlbumCard = styled(Card)`
  cursor: pointer;
  transition: transform 0.2s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }

  .ant-card-cover img {
    height: 160px;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
  }
`;

const ArtistDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { artistId } = useParams<{ artistId: string }>();
  const { data: artist, isLoading: isArtistLoading } = useArtistDetail(
    artistId!
  );
  const { data: albums, isLoading: isAlbumLoading } = useAlbumByArtist(
    artistId!
  );

  if (isArtistLoading || isAlbumLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!artist) {
    return <Empty description="Không tìm thấy nghệ sĩ" />;
  }

  return (
    <Container>
      <ArtistHeader>
        <ArtistAvatar src={artist.avatar} />
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {artist.name}
          </Title>
          <Tag color="blue" style={{ marginTop: 4 }}>
            {artist.genre?.name}
          </Tag>
          <Paragraph style={{ marginTop: 16, maxWidth: 600 }}>
            {artist.bio}
          </Paragraph>
        </div>
      </ArtistHeader>

      <div>
        <Title level={3}>Albums</Title>
        {albums?.length ? (
          <Row gutter={[24, 24]}>
            {albums.map((album) => (
              <Col xs={24} sm={12} md={8} lg={6} key={album._id}>
                <AlbumCard
                  cover={
                    <img src={album.songs?.[0].thumbnail} alt={album.title} />
                  }
                  hoverable
                  onClick={() => {
                    navigate(`/album/${album._id}`);
                  }}
                >
                  <Card.Meta
                    title={album.title}
                    description={new Date(
                      album.releaseDate
                    ).toLocaleDateString()}
                  />
                </AlbumCard>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Nghệ sĩ này chưa có album nào" />
        )}
      </div>
    </Container>
  );
};

export default ArtistDetailPage;
