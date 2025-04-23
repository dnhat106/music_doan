import React from "react";
import {
  Button,
  Space,
  Modal,
  message,
  notification,
  Spin,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { TableContainer, StyledTable } from "./styles";
import { useQueryClient } from "@tanstack/react-query";
import { useAllUsers } from "../../hook/auth/useAllUsers";
import { useDeleteUser } from "../../hook/auth/useDeleteUser";

const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useAllUsers();
  const { mutate: deleteUser } = useDeleteUser();

  if (isLoading || !users) return <Spin size="large" />;

  const handleDelete = (userId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      onOk: () => {
        deleteUser(userId, {
          onSuccess: () => {
            message.success("User deleted");
            queryClient.invalidateQueries({ queryKey: ["users"] });
          },
          onError: (error: any) => {
            notification.error({
              message: "Failed to delete user",
              description: error.response?.data?.message || error.message,
            });
          },
        });
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "adminId",
      key: "adminId",
      render: (adminId: string) => adminId ? "Admin" : "User",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          {!record.adminId && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <TableContainer>
      <StyledTable columns={columns} dataSource={users} rowKey="_id" />
    </TableContainer>
  );
};

export default UserManagement;
