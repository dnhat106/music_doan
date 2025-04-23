import React, { useState } from "react";
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Spin,
  notification,
  DatePicker,
  Select,
  List,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { TableContainer, StyledTable } from "./styles";
import { Song, useAllSongs } from "../../hook/song/useAllSongs";
import { useUpdateSong } from "../../hook/song/useUpdateSong";
import { useDeleteSong } from "../../hook/song/useDeleteSong";
import { useAllGenres } from "../../hook/genre/useAllGenres";
import { useAllSongsByQuery } from "../../hook/song/useAllSongsByQuery";
import { useImportSongByQuery } from "../../hook/song/useImportSongByQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useImportAllSongByQuery } from "../../hook/song/useImportAllSongByQuery";

const { Option } = Select;

const SongManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: songs, isLoading } = useAllSongs();
  const { data: genres } = useAllGenres();
  const { mutate: updateSongMutation } = useUpdateSong();
  const { mutate: deleteSongMutation } = useDeleteSong();
  const { mutate: importSongMutation, isPending: isImporting } =
    useImportSongByQuery();
  const { mutate: importAllSongMutation, isPending: isImportingAll } =
    useImportAllSongByQuery();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [spotifyQuery, setSpotifyQuery] = useState("");
  const { data: spotifyTracks, isFetching: isSearching } =
    useAllSongsByQuery(spotifyQuery);
  console.log(spotifyTracks);
  if (isLoading || !songs) return <Spin size="large" />;

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Genre", dataIndex: ["genre", "name"], key: "genre" },
    { title: "Play Count", dataIndex: "playCount", key: "playCount" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Song) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
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

  const handleEdit = (song: Song) => {
    setEditingSong(song);
    setIsModalVisible(true);
    setTimeout(() => {
      form.setFieldsValue({
        ...song,
        genre: song.genre._id,
        releaseDate: dayjs(song.releaseDate),
      });
    }, 0);
  };

  const handleDelete = (song: Song) => {
    Modal.confirm({
      title: "Are you sure you want to delete this song?",
      onOk: () => {
        deleteSongMutation(song._id, {
          onSuccess: () => {
            message.success("Song deleted");
            queryClient.invalidateQueries({ queryKey: ["songs"] });
          },
          onError: (error: any) => {
            notification.error({
              message: "Failed to delete song",
              description: error.response?.data?.message || error.message,
            });
          },
        });
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        releaseDate: values.releaseDate.toISOString(),
      };
      updateSongMutation(
        { songId: editingSong?._id || "", data: payload },
        {
          onSuccess: () => {
            message.success("Song updated");
            setIsModalVisible(false);
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ["songs"] });
          },
          onError: (error) => {
            notification.error({
              message: "Failed to update song",
              description: error.message,
            });
          },
        }
      );
    });
  };

  const handleImport = (trackName: string) => {
    importSongMutation(trackName, {
      onSuccess: () => {
        message.success("Song imported successfully");
        queryClient.invalidateQueries({ queryKey: ["songs"] });
        setIsImportModalVisible(false);
      },
      onError: (error: any) => {
        notification.error({
          message: "Failed to import song",
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  const handleImportAll = () => {
    importAllSongMutation(spotifyQuery, {
      onSuccess: () => {
        message.success("All songs imported successfully");
        queryClient.invalidateQueries({ queryKey: ["songs"] });
        setIsImportModalVisible(false);
      },
      onError: (error: any) => {
        notification.error({
          message: "Failed to import all songs",
          description: error.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <TableContainer>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<CloudDownloadOutlined />}
          onClick={() => setIsImportModalVisible(true)}
        >
          Import from Spotify
        </Button>
      </Space>

      <StyledTable 
        columns={columns} 
        dataSource={songs} 
        rowKey="_id" 
        pagination={{
          pageSize: 5, // Adjust the pageneeded size as 
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
        }} 
      />

      {/* Edit Modal */}
      <Modal
        title={"Edit Song"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        {isModalVisible && (
          <Form form={form} layout="vertical">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
              <Select placeholder="Select genre">
                {genres?.map((genre) => (
                  <Option value={genre._id} key={genre._id}>
                    {genre.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="lyric" label="Lyric">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="releaseDate"
              label="Release Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="thumbnail" label="Thumbnail (URL)">
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Import Song from Spotify"
        open={isImportModalVisible}
        onCancel={() => setIsImportModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Input.Search
            placeholder="Search Spotify track..."
            enterButton
            allowClear
            loading={isSearching}
            onSearch={(value) => setSpotifyQuery(value)}
          />

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={handleImportAll}
              loading={isImportingAll}
              disabled={!spotifyTracks?.length}
            >
              Import All
            </Button>
          </div>

          <List
            style={{ maxHeight: 300, overflowY: "auto" }}
            loading={isSearching}
            bordered
            dataSource={spotifyTracks || []}
            renderItem={(track) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    loading={isImporting}
                    onClick={() => handleImport(track.name)}
                  >
                    Import
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={track.name}
                  description={track.artists.map((a: any) => a.name).join(", ")}
                />
              </List.Item>
            )}
          />
        </Space>
      </Modal>
    </TableContainer>
  );
};

export default SongManagement;
