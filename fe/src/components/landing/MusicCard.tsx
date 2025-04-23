import React from 'react';
import { Card, Typography, Image } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Song } from '../../hook/song/useAllSongs';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
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

const SongImage = styled(Image)`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
`;

interface MusicCardProps {
  song: Song;
}

const MusicCard: React.FC<MusicCardProps> = ({ song }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/song/${song._id}`);
  };

  return (
    <StyledCard
      hoverable
      onClick={handleClick}
      cover={
        <SongImage
          src={song.thumbnail}
          alt={song.title}
          fallback="https://via.placeholder.com/300x300?text=No+Image"
        />
      }
    >
      <Title level={5} ellipsis={{ rows: 1 }}>
        {song.title}
      </Title>
      <Text type="secondary">{"Chưa lấy artist"}</Text>
    </StyledCard>
  );
};

export default MusicCard; 