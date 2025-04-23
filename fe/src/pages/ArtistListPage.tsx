import React from "react";
import { Card, Row, Col, Typography, Spin, Tag } from "antd";
import { useAllArtists } from "../hook/artist/useAllArtists";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Title, Paragraph } = Typography;

const ArtistListContainer = styled.div`
  padding: 32px 24px 80px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const ArtistImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0;
`;

const ArtistName = styled(Title)`
  && {
    font-size: 18px;
    margin-bottom: 4px;
    color: #222;
  }
`;

const ArtistGenre = styled(Tag)`
  font-weight: 500;
`;

const Bio = styled(Paragraph)`
  color: #666;
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
`;

const ArtistListPage: React.FC = () => {
  const { data: artists, isLoading } = useAllArtists();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ArtistListContainer>
      <Title level={2} style={{ marginBottom: 32 }}>
        Danh sách nghệ sĩ
      </Title>

      <Row gutter={[24, 24]}>
        {artists?.map((artist) => (
          <Col xs={24} sm={12} md={8} lg={6} key={artist._id}>
            <StyledCard
              hoverable
              onClick={() => navigate(`/artist/${artist._id}`)}
              cover={<ArtistImage src={artist.avatar} alt={artist.name} />}
            >
              <ArtistGenre color="blue">{artist.genre?.name}</ArtistGenre>
              <ArtistName level={5}>{artist.name}</ArtistName>
              <Bio ellipsis={{ rows: 3, expandable: false }}>
                {artist.bio}
              </Bio>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </ArtistListContainer>
  );
};

export default ArtistListPage;
