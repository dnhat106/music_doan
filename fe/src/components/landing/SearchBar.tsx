import { Input, Spin } from 'antd';
import styled from 'styled-components';
import { useAllSongs } from '../../hook/song/useAllSongs';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const StyledSearch = styled(Input.Search)`
  position: relative;
  margin-top: 15px;
  .ant-input {
    border-radius: 15px;
    color: #333;
    background-color: transparent;
    border-color: black;
  }
  .ant-input-search-button {
    border-radius: 15px;
    background-color: #333;
    color: white;
    &:hover{
      background-color: #333 !important;
    }
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 80%;
  right: 0;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const SearchResultItem = styled.div`
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SongImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.div`
  font-weight: 500;
  color: #333;
  height: 20px;
`;

const ArtistName = styled.div`
  font-size: 12px;
  color: #666;
`;

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: allSongs, isLoading } = useAllSongs();
  const navigate = useNavigate();

  const filteredSongs = useMemo(() => {
    if (!searchQuery || !allSongs) return [];
    const query = searchQuery.toLowerCase();
    return allSongs.filter(song => 
      song.title.toLowerCase().includes(query)
      // song.artist?.name.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery, allSongs]);

  const onSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSongClick = (songId: string) => {
    navigate(`/song/${songId}`);
    setSearchQuery('');
  };

  return (
    <div style={{ position: 'relative' }}>
      <StyledSearch 
        placeholder="Search Song"
        onSearch={onSearch}
        onChange={(e) => onSearch(e.target.value)}
        value={searchQuery}
        enterButton
      />
      {searchQuery && (
        <SearchResults>
          {isLoading ? (
            <div style={{ padding: '12px', textAlign: 'center' }}>
              <Spin size="small" />
            </div>
          ) : filteredSongs.length ? (
            filteredSongs.map((song) => (
              <SearchResultItem 
                key={song._id} 
                onClick={() => handleSongClick(song._id)}
              >
                <SongImage 
                  src={song.thumbnail} 
                  alt={song.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=No+Image';
                  }}
                />
                <SongInfo>
                  <SongTitle>{song.title}</SongTitle>
                  <ArtistName>{'Unknown Artist'}</ArtistName>
                </SongInfo>
              </SearchResultItem>
            ))
          ) : (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              No results found
            </div>
          )}
        </SearchResults>
      )}
    </div>
  );
};
