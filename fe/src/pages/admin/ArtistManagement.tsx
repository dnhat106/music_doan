import React, { useState } from "react";
import { Button, Space, Modal, Form, Input, message, Spin, notification, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { TableContainer, ActionButton, StyledTable } from "./styles";
import type { TableProps } from "antd";
import { Artist, useAllArtists } from "../../hook/artist/useAllArtists";
import { useCreateArtist } from "../../hook/artist/useCreateArtist";
import { useUpdateArtist } from "../../hook/artist/useUpdateArtist";
import { useDeleteArtist } from "../../hook/artist/useDeleteArtist";
import { useQueryClient } from "@tanstack/react-query";
import { useAllGenres } from "../../hook/genre/useAllGenres";

const ArtistManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: artists, isLoading: isLoadingArtists } = useAllArtists();
  const { data: genres, isLoading: isLoadingGenres } = useAllGenres();
  const { mutate: createArtistMutation } = useCreateArtist();
  const { mutate: updateArtistMutation } = useUpdateArtist();
  const { mutate: deleteArtistMutation } = useDeleteArtist();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [form] = Form.useForm();

  if (isLoadingArtists || isLoadingGenres || !artists || !genres) {
    return <Spin size="large" />;
  }

  const columns: TableProps<Artist>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img src={avatar} alt="avatar" style={{ width: 50, height: 50, objectFit: "cover" }} />
      ),
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      render: (genre) => {
        return genre ? genre.name : "Unknown";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Artist) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
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

  const handleAdd = () => {
    setEditingArtist(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    form.setFieldsValue({
      name: artist.name,
      avatar: artist.avatar,
      bio: artist.bio,
      genre: artist.genre._id
    });
    setIsModalVisible(true);
  };

  const handleDelete = (artist: Artist) => {
    Modal.confirm({
      title: "Are you sure you want to delete this artist?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteArtistMutation(artist._id, {
          onSuccess: () => {
            message.success("Artist deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["artists"] });
          },
          onError: (error: any) => {
            notification.error({
              message: "Failed to delete artist",
              description: error.response?.data?.errors[0].errorMessage || error.message,
            });
            console.error("Delete artist error:", error.response?.data?.errors[0].errorMessage);
          },
        });
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingArtist) {
        updateArtistMutation(
          { id: editingArtist._id, body: values },
          {
            onSuccess: () => {
              message.success("Artist updated successfully");
              setIsModalVisible(false);
              form.resetFields();
              queryClient.invalidateQueries({ queryKey: ["artists"] });
            },
            onError: (error: any) => {
              notification.error({
                message: "Failed to update artist",
                description: error.response?.data?.errors[0].errorMessage || error.message,
              });
              console.error("Update artist error:", error.response?.data?.errors[0].errorMessage);
            },
          }
        );
      } else {
        createArtistMutation(values, {
          onSuccess: () => {
            message.success("Artist created successfully");
            setIsModalVisible(false);
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ["artists"] });
          },
          onError: (error: any) => {
            notification.error({
              message: "Failed to create artist",
              description: error.response?.data?.errors[0].errorMessage || error.message,
            });
            console.error("Create artist error:", error.response?.data?.errors[0].errorMessage);
          },
        });
      }
    });
  };

  return (
    <TableContainer>
      <ActionButton type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Artist
      </ActionButton>

      <StyledTable 
        columns={columns} 
        dataSource={artists} 
        rowKey="_id" 
        pagination={{
          pageSize: 5, // Adjust the pageneeded size as
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
      />

      <Modal
        title={editingArtist ? "Edit Artist" : "Add Artist"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input artist name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="avatar"
            label="Avatar URL"
            rules={[{ required: true, message: "Please input avatar URL!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bio"
            label="Bio"
            rules={[{ required: true, message: "Please input artist bio!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: true, message: "Please select a genre!" }]}
          >
            <Select>
              {genres.map((genre) => (
                <Select.Option key={genre._id} value={genre._id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </TableContainer>
  );
};

export default ArtistManagement; 