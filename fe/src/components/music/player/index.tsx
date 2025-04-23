import React, { useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useAudioPlayer } from "../../../context/AudioPlayerContext";

const Wrapper = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #1f1f1f;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  z-index: 2;
`;

const TrackImage = styled.img`
  background-color: #1f1f1f;
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 2;
  margin-left: 8px;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
`;

const TrackDetails = styled.div`
  position: absolute;
  background-color: #1f1f1f;
  bottom: 35px;
  left: 88px;
  display: flex;
  flex-direction: column;
  color: #FFF;
  z-index: 2;
`;

const Title = styled.div`
  background-color: #1f1f1f;
  font-size: 17px;
  font-weight: bold;
  width: 100%;
  z-index: 2;
`;

const Artist = styled.div`
  font-size: 15px;
  color: #b7a8a8;
  width: 100%;
  width: 20vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #1f1f1f;
  z-index: 2;
`;

const IframeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const MusicPlayer: React.FC = () => {
  const { currentTrack } = useAudioPlayer();

  useEffect(() => {}, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <Wrapper
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
        <TrackImage src={currentTrack.thumbnail} alt="Track artwork" />
        <TrackDetails>
          <Title>{currentTrack.title}</Title>
          <Artist>{currentTrack.genre?.name}</Artist>
        </TrackDetails>

      <IframeContainer>
        <iframe
          src={`https://open.spotify.com/embed/track/${currentTrack.secureUrl}?theme=0`}
          width="100%"
          height="100%"
          style={{ border: "none", height: 150 }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          title="Spotify Player"
        />
      </IframeContainer>
    </Wrapper>
  );
};

export default MusicPlayer;
