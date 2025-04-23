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
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { TableContainer, ActionButton, StyledTable } from "./styles";
import type { TableProps } from "antd";
import { Genre, useAllGenres } from "../../hook/genre/useAllGenres";
import { useCreateGenre } from "../../hook/genre/useCreateGenre";
import { useUpdateGenre } from "../../hook/genre/useUpdateGenre";
import { useDeleteGenre } from "../../hook/genre/useDeleteGenre";
import { useQueryClient } from "@tanstack/react-query";

const GenreManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: genres, isLoading } = useAllGenres();
  const { mutate: createGenreMutation } = useCreateGenre();
  const { mutate: updateGenreMutation } = useUpdateGenre();
  const { mutate: deleteGenreMutation } = useDeleteGenre();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [form] = Form.useForm();

  if (isLoading || !genres) {
    return <Spin size="large" />;
  }

  const columns: TableProps<Genre>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Genre) => (
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
    setEditingGenre(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    form.setFieldsValue(genre);
    setIsModalVisible(true);
  };

  const handleDelete = (genre: Genre) => {
    Modal.confirm({
      title: "Are you sure you want to delete this genre?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteGenreMutation(genre._id, {
          onSuccess: () => {
            message.success("Genre deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["genres"] });
          },
          onError: (error: any) => {
            notification.error({
              message: "Failed to delete genre",
              description:
                error.response?.data?.errors[0].errorMessage || error.message,
            });
            console.error(
              "Delete genre error:",
              error.response?.data?.errors[0].errorMessage
            );
          },
        });
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingGenre) {
        updateGenreMutation(
          { id: editingGenre._id, body: values },
          {
            onSuccess: () => {
              message.success("Genre updated successfully");
              setIsModalVisible(false);
              form.resetFields();
              queryClient.invalidateQueries({ queryKey: ["genres"] });
            },
            onError: (error) => {
              notification.error({
                message: "Failed to update genre",
                description: error.message,
              });
              console.error("Update genre error:", error.message);
            },
          }
        );
      } else {
        createGenreMutation(values, {
          onSuccess: () => {
            message.success("Genre created successfully");
            setIsModalVisible(false);
            form.resetFields();
            queryClient.invalidateQueries({ queryKey: ["genres"] });
          },
          onError: (error) => {
            notification.error({
              message: "Failed to Create genre",
              description: error.message,
            });
            console.error("Create genre error:", error);
          },
        });
      }
    });
  };

  return (
    <TableContainer>
      <ActionButton type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Genre
      </ActionButton>

      <StyledTable
        columns={columns}
        dataSource={genres}
        rowKey="_id"
        pagination={{
          pageSize: 5, // Adjust the pageneeded size as
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
      />

      <Modal
        title={editingGenre ? "Edit Genre" : "Add Genre"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input genre name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input genre description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </TableContainer>
  );
};

export default GenreManagement;
