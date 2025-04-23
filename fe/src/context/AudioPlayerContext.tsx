// contexts/AudioPlayerContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Song } from "../hook/song/useAllSongs";
import { useCountPlaySong } from "../hook/song/useCountPlaySong";


interface AudioPlayerContextProps {
  currentTrack: Song | null;
  playTrack: (track: Song) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const { mutate: countPlaySong } = useCountPlaySong();
  const playTrack = (track: Song) => {
    countPlaySong(track._id);
    setCurrentTrack(track);
  };

  return (
    <AudioPlayerContext.Provider
      value={{ currentTrack, playTrack }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};
