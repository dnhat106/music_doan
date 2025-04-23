import User from '@/databases/entities/User';
import Song, { ISong } from '@/databases/entities/Song';
import { CreateSongDto } from './type';
import mongoose from 'mongoose';
import Album from '@/databases/entities/Album';
import MusicalArtist from '@/databases/entities/Artist';
import GenreService from '../genre/GenreService';
import { getSpotifyToken } from '@/utils/getSpotifyToken';
import axios from 'axios';
import History from '@/databases/entities/History';
import Recommendation, {
  IRecommendation,
} from '@/databases/entities/Recommendation';

interface SpotifyTrack {
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  album: {
    name: string;
    release_date: string;
    images: { url: string }[];
    external_urls: { spotify: string };
    artists: { name: string; external_urls: { spotify: string } }[];
  };
  artists: {
    name: string;
    external_urls: { spotify: string };
    id: string;
  }[];
  id: string;
}

class SongService {
  async updateSong(songId: string, data: CreateSongDto): Promise<ISong> {
    const song = await Song.findByIdAndUpdate(songId, data, { new: true });
    if (!song) {
      throw new Error('Song not found');
    }
    return song;
  }
  async deleteSong(songId: string) {
    const song = await Song.findByIdAndDelete(songId);
    if (!song) {
      throw new Error('Song not found');
    }
    return song;
  }
  async getAllSongs() {
    const songs = await Song.find().populate('genre').sort({ createdAt: -1 });
    return songs;
  }
  async toggleFavoriteSong(userId: string, songId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const song = await Song.findById(songId);
    if (!song) {
      throw new Error('Song not found');
    }

    const isFavorite = user.favoriteSongs?.some(
      (favoriteSongId) => favoriteSongId.toString() === songId
    );

    if (isFavorite) {
      user.favoriteSongs = user.favoriteSongs?.filter(
        (favoriteSongId) => favoriteSongId.toString() !== songId
      ); // unfavorite
    } else {
      user.favoriteSongs?.push(new mongoose.Types.ObjectId(songId));
    }

    await user.save();
    return user.favoriteSongs;
  }

  async importSpotifyTracks(
    tracks: SpotifyTrack[],
    adminId: mongoose.Types.ObjectId
  ) {
    for (const track of tracks) {
      const mainArtist = track.artists[0];
      const genre = await GenreService.getOrCreateGenreFromArtist(
        mainArtist.id
      );

      let artistDoc = await MusicalArtist.findOne({ name: mainArtist.name });
      if (!artistDoc) {
        const token = await getSpotifyToken();
        const response = await axios.get(
          `https://api.spotify.com/v1/artists/${mainArtist.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        artistDoc = await MusicalArtist.create({
          name: mainArtist.name,
          avatar: response.data.images[0].url,
          genre,
          bio: `Spotify artist: ${mainArtist.external_urls.spotify}`,
        });
      }

      // 3. Tìm hoặc tạo album
      let albumDoc = await Album.findOne({
        title: track.album.name,
        artist: artistDoc._id,
      });
      if (!albumDoc) {
        albumDoc = await Album.create({
          title: track.album.name,
          artist: artistDoc._id,
          releaseDate: new Date(track.album.release_date),
          coverAt: track.album.images?.[0]?.url || '',
          songs: [],
        });
      }

      // 4. Tạo song
      let songDoc = await Song.findOne({ secureUrl: track.id });
      if (!songDoc) {
        const duration = `${Math.floor(track.duration_ms / 60000)}:${String(
          Math.floor((track.duration_ms % 60000) / 1000)
        ).padStart(2, '0')}`;

        const songDoc = await Song.create({
          title: track.name,
          genre,
          lyric: '123',
          playCount: 0,
          duration,
          releaseDate: new Date(track.album.release_date),
          secureUrl: track.id,
          thumbnail: track.album.images?.[0]?.url || '',
          admin: adminId,
        });

        if (!albumDoc.songs.includes(songDoc._id as mongoose.Types.ObjectId)) {
          albumDoc.songs.push(songDoc._id as mongoose.Types.ObjectId);
          await albumDoc.save();
        }
      }
    }
    return { message: 'Import completed.' };
  }
  async countPlaySong(songId: string) {
    const song = await Song.findById(songId);
    if (!song) {
      throw new Error('Song not found');
    }
    song.playCount++;
    await song.save();
    return song;
  }
  async searchSong(query: string) {
    const songs = await Song.find({ title: { $regex: query, $options: 'i' } });
    return songs;
  }
  async addToHistory(userId: string, songId: string) {
    const history = await History.create({ user: userId, song: songId });
    await history.save();
  }
  async getHistory(userId: string) {
    const history = await History.find({ user: userId })
      .populate('song')
      .sort({ createdAt: -1 });
    return history;
  }
  async recommendByAlbumHistory(userId: string): Promise<IRecommendation[]> {
    const histories = await History.find({ user: userId }).populate('song');
    const recommendationList: IRecommendation[] = [];

    const idCount = histories.reduce<Record<string, number>>((acc, item) => {
      const id = item.song._id.toString();
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const seen = new Set<string>();
    const resultMoreThan5: typeof histories = [];

    for (const item of histories) {
      const songId = item.song._id.toString();
      if (idCount[songId] >= 5 && !seen.has(songId)) {
        resultMoreThan5.push(item);
        seen.add(songId);
      }
    }
    console.log(resultMoreThan5);
    for (const item of resultMoreThan5) {
      const album = await Album.findOne({ songs: item.song._id });
      if (album) {
        const filteredSongs = album.songs.filter(
          (song) => song._id.toString() !== item.song._id.toString()
        );

        const existing = await Recommendation.findOne({
          user: userId,
          // Kiểm tra xem recommendation đã có tất cả bài hát chưa
          songs: {
            $all: filteredSongs.map((s) => s._id),
          },
        });

        if (!existing && filteredSongs.length > 0) {
          const recommendation = await Recommendation.create({
            user: userId,
            songs: filteredSongs,
          });
          recommendationList.push(recommendation);
        }
      }
    }

    return recommendationList;
  }
  async getRecommendation(userId: string) {
    const recommendation = await Recommendation.find({ user: userId }).populate({
      path: 'songs',
      populate: {
        path: 'genre'
      }
    });
    return recommendation;
  }
}

export default new SongService();
