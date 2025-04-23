import {
  HeartFilled,
  HeartOutlined,
  MoreOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, notification } from "antd";
import styled from "styled-components";
import { Song } from "../../hook/song/useAllSongs";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { useLikeSong } from "../../hook/song/useLikeSong";
import { useFavoriteSongs } from "../../hook/song/useFavoriteSongs";
import { useQueryClient } from "@tanstack/react-query";
import { AddToPlaylistModal } from "../playlist/addToPlaylistModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Title = styled.div`
  padding: 20px 0;
  font-weight: bold;
  font-size: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  border-radius: 10px;
`;

interface SectionListMusicProps {
  songs: Song[];
  playlistName?: string;
}

export const SectionListMusic = ({
  songs,
  playlistName,
}: SectionListMusicProps) => {
  const queryClient = useQueryClient();
  const { playTrack } = useAudioPlayer();
  const { mutate } = useLikeSong();
  const { data } = useFavoriteSongs();

  const handleLikeSong = (songId: string) => {
    mutate(songId, {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries({ queryKey: ["my-info"] });
      },
      onError: (error) => {
        notification.error({ message: error.message });
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Title>{playlistName ? playlistName : "Popular Songs"}</Title>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {songs?.map((song, index) => (
          <MusicCard
            songId={song._id}
            playTrack={() => playTrack(song)}
            key={index}
            imageUrl={song.thumbnail}
            title={song.title}
            isFavorite={
              data?.some((favoriteSong) => favoriteSong._id === song._id) ||
              false
            }
            subTitle={song.genre?.name || "Unknown Genre"}
            likeSong={() => handleLikeSong(song._id)}
          />
        ))}
      </div>
    </div>
  );
};

const StyledCard = styled(Card)`
  width: 230px;
  height: 330px;
  border-radius: 15px;
  background-color: #3a3a3a;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
  color: #fff;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.8);
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 2px solid #ccc;
`;

const PlayButton = styled(Button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  padding: 15px;
  color: #fff;
  font-size: 22px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

const StyledTitle = styled.h3`
  text-align: center;
  font-size: 18px;
  margin: 10px 0;
  color: #fff;
  transition: color 0.3s ease;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: #ff6347;
  }
`;

const StyledSubTitle = styled.p`
  text-align: center;
  color: #aaa;
  font-size: 14px;
  &:hover {
    color: #fff;
  }
`;

const FavoriteButton = styled(Button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent;
  border: none;
  font-size: 22px;
  color: #fff;
  z-index: 2;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
    background-color: transparent !important;
  }
`;

interface MusicCardType {
  imageUrl: string;
  title: string;
  subTitle: string;
  playTrack: () => void;
  isFavorite: boolean;
  likeSong: () => void;
  songId: string;
}

const MoreButton = styled(Button)`
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  z-index: 2;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const items = [
  {
    key: 1,
    label: "Add to Playlist"
  }
];

const MusicCard = ({
  imageUrl,
  title,
  subTitle,
  playTrack,
  isFavorite,
  likeSong,
  songId,
}: MusicCardType) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuClick = (e: any) => {
    if (e.key === "1") {
      setIsModalOpen(true);
    }
  };
  const handleClick = () => {
    navigate(`/song/${songId}`);
  };
  return (
    <StyledCard hoverable>
      <div style={{ position: "relative" }}>
        <StyledImage alt="album" src={imageUrl} />
        <PlayButton
          shape="circle"
          icon={<PlayCircleOutlined />}
          onClick={playTrack}
        />
        <FavoriteButton onClick={likeSong}>
          {isFavorite ? (
            <HeartFilled style={{ color: "red" }} />
          ) : (
            <HeartOutlined />
          )}
        </FavoriteButton>

        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick,
          }}
          placement="bottomRight"
        >
          <MoreButton shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
      <StyledTitle onClick={handleClick}>{title}</StyledTitle>
      <StyledSubTitle>{subTitle}</StyledSubTitle>
      <AddToPlaylistModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        songId={songId}
      />
    </StyledCard>
  );
};
