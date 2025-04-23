import React, { useState } from "react";
import { Button, Space, Modal, Form, Input, message, Spin, notification, Select, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { TableContainer, ActionButton, StyledTable } from "./styles";
import type { TableProps } from "antd";
import { Album, useAllAlbums } from "../../hook/album/useAllAlbums";
import { useCreateAlbum } from "../../hook/album/useCreateAlbum";
import { useUpdateAlbum } from "../../hook/album/useUpdateAlbum";
import { useDeleteAlbum } from "../../hook/album/useDeleteAlbum";
import { useAddSongToAlbum } from "../../hook/album/useAddSongToAlbum";
import { useQueryClient } from "@tanstack/react-query";
import { useAllArtists } from "../../hook/artist/useAllArtists";
import { useAllSongs } from "../../hook/song/useAllSongs";
import dayjs from "dayjs";

const AlbumManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: albums, isLoading: isLoadingAlbums } = useAllAlbums();
  const { data: artists, isLoading: isLoadingArtists } = useAllArtists();
  const { data: songs, isLoading: isLoadingSongs } = useAllSongs();
  const { mutate: createAlbumMutation } = useCreateAlbum();
  const { mutate: updateAlbumMutation } = useUpdateAlbum();
  const { mutate: deleteAlbumMutation } = useDeleteAlbum();
  const { mutate: addSongToAlbumMutation } = useAddSongToAlbum();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddSongModalVisible, setIsAddSongModalVisible] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [form] = Form.useForm();
  const [addSongForm] = Form.useForm();

  if (isLoadingAlbums || isLoadingArtists || isLoadingSongs || !albums || !artists || !songs) {
    return <Spin size="large" />;
  }

  const columns: TableProps<Album>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Cover Image",
      dataIndex: "coverAt",
      key: "coverAt",
      render: (coverAt) => (
        <img src={coverAt} alt="cover" style={{ width: 50, height: 50, objectFit: "cover" }} />
      ),
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
      render: (artist) => artist.name,
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Songs",
      key: "songs",
      render: (_, record: Album) => (
        <span>{record.songs?.length || 0} songs</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Album) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            type="default"
            icon={<PlusCircleOutlined />}
            onClick={() => handleAddSong(record)}
          >
            Add Song
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingAlbum(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    form.setFieldsValue({
      title: album.title,
      coverAt: album.coverAt,
      artist: album.artist._id,
      releaseDate: dayjs(album.releaseDate),
    });
    setIsModalVisible(true);
  };

  const handleAddSong = (album: Album) => {
    setSelectedAlbum(album);
    addSongForm.resetFields();
    addSongForm.setFieldsValue({
      songIds: album.songs?.map(song => song._id) || []
    });
    setIsAddSongModalVisible(true);
  };

  const handleAddSongToAlbum = () => {
    addSongForm.validateFields().then((values) => {
      if (selectedAlbum) {
        addSongToAlbumMutation(
          { albumId: selectedAlbum._id, songIds: values.songIds },
          {
            onSuccess: () => {
              message.success("Songs added to album successfully");
              setIsAddSongModalVisible(false);
              addSongForm.resetFields();
              queryClient.invalidateQueries({ queryKey: ["albums"] });
            },
            onError: (error: any) => {
              notification.error({
                message: "Failed to add songs to album",
                description: error.response?.data?.errors[0].errorMessage || error.message,
              });
            },
          }
        );
      }
    });
  };

  const handleDelete = (album: Album) => {
    Modal.confirm({
      title: "Are you sure you want to delete this album?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteAlbumMutation(album._id, {
          onSuccess: () => {
            message.success("Album deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["albums"] });
          },
          onError: (error: any) => {
            notification.error({
              message: "Failed to delete album",
              description: error.response?.data?.errors[0].errorMessage || error.message,
            });
          },
        });
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingAlbum) {
        updateAlbumMutation(
          { id: editingAlbum._id, body: values },
          {
            onSuccess: () => {
              message.success("Album updated successfully");
              setIsModalVisible(false);
              form.resetFields();
              queryClient.invalidateQueries({ queryKey: ["albums"] });
            },
            onError: (error: any) => {
              notification.error({
                message: "Failed to update album",
                description: error.response?.data?.errors[0].errorMessage || error.message,
              });
            },
          }
        );
      } else {
        createAlbumMutation(values, {
          onSuccess: () => {
            message.success("Album created successfully");
            setIsModalVisible(false);
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ["albums"] });
          },
          onError: (error: any) => {
            notification.error({
              message: "Failed to create album",
              description: error.response?.data?.errors[0].errorMessage || error.message,
            });
          },
        });
      }
    });
  };

  return (
    <TableContainer>
      <ActionButton type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Album
      </ActionButton>

      <StyledTable 
        columns={columns} 
        dataSource={albums} 
        rowKey="_id" 
        pagination={{
          pageSize: 5, // Adjust the pageneeded size as
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
      />

      <Modal
        title={editingAlbum ? "Edit Album" : "Add Album"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input album title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="coverAt"
            label="Cover Image URL"
            rules={[{ required: true, message: "Please input cover image URL!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="artist"
            label="Artist"
            rules={[{ required: true, message: "Please select an artist!" }]}
          >
            <Select>
              {artists.map((artist) => (
                <Select.Option key={artist._id} value={artist._id}>
                  {artist.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="Release Date"
            rules={[{ required: true, message: "Please select release date!" }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Manage Songs in ${selectedAlbum?.title}`}
        open={isAddSongModalVisible}
        onOk={handleAddSongToAlbum}
        onCancel={() => setIsAddSongModalVisible(false)}
      >
        <Form form={addSongForm} layout="vertical">
          <Form.Item
            name="songIds"
            label="Select Songs"
            rules={[{ required: true, message: "Please select at least one song!" }]}
          >
            <Select mode="multiple">
              {songs.map((song) => (
                <Select.Option 
                  key={song._id} 
                  value={song._id}
                >
                  {song.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div>
            <h4>Current Songs in Album:</h4>
            <ul>
              {selectedAlbum?.songs?.map(song => (
                <li key={song._id}>{song.title}</li>
              ))}
            </ul>
          </div>
        </Form>
      </Modal>
    </TableContainer>
  );
};

export default AlbumManagement; 