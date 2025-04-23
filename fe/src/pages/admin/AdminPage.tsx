import React from 'react';
import { Tabs } from 'antd';
import GenreManagement from './GenreManagement';
import ArtistManagement from './ArtistManagement';
import AlbumManagement from './AlbumManagement';
import { AdminContainer, AdminHeader } from './styles';
import SongManagement from './SongManagement';
import UserManagement from './UserManagement';

const AdminPage: React.FC = () => {
  const items = [
    {
      key: 'genres',
      label: 'Genres',
      children: <GenreManagement />,
    },
    {
      key: 'artists',
      label: 'Artists',
      children: <ArtistManagement />,
    },
    {
      key: 'albums',
      label: 'Albums',
      children: <AlbumManagement />,
    },
    {
      key: 'songs',
      label: 'Songs',
      children: <SongManagement />,
    },
    {
      key: 'users',
      label: 'Users',
      children: <UserManagement />,
    },
  ];

  return (
    <AdminContainer>
      <AdminHeader>Admin Dashboard</AdminHeader>
      <Tabs items={items} />
    </AdminContainer>
  );
};

export default AdminPage; 