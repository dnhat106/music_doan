import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Button,
  Typography,
  Spin,
  message,
  Modal,
  Form,
  Input,
  Empty,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useAllMyPlaylists } from "../hook/playlist/useAllMyPlaylist";
import { useUpdateUser } from "../hook/auth/useUpdateUser";
import { useQueryClient } from "@tanstack/react-query";
import { useUserInfo } from "../hook/auth/useUserInfo";
import { useChangePassword } from "../hook/auth/useChangePassword";
import { useMyHistory } from "../hook/song/useMyHistory";

const { Title, Text } = Typography;

const ProfileContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 80px;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const UserAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  font-size: 48px;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const PlaylistsSection = styled.div`
  margin-top: 32px;
`;
const HistorySection = styled.div`
  margin-top: 48px;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  margin-bottom: 16px;
`;

const HistoryImage = styled.img`
  width: 81px;
  height: 81px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const StyledCard = styled(Card)`
  .ant-card-cover {
    height: 200px;
    overflow: hidden;
  }

  .ant-card-meta-title {
    white-space: normal;
  }
`;

const PlaylistImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HistoryList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

export const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUserInfo();
  const { logout } = useAuth();
  const { data: playlists, isLoading } = useAllMyPlaylists();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { data: history, isLoading: isHistoryLoading } = useMyHistory();

  const navigate = useNavigate();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const { mutate: changePassword, isPending } = useChangePassword();

  const handleLogout = () => {
    logout();
    navigate("/login");
    message.success("Logged out successfully");
  };

  const showEditModal = () => {
    form.setFieldsValue({
      username: user?.username,
      phone: user?.phone || "",
    });
    setIsEditModalVisible(true);
  };

  const handleEditProfile = (values: { username: string; phone: string }) => {
    if (!user) return;

    updateUser(
      { ...user, ...values },
      {
        onSuccess: () => {
          message.success("Profile updated successfully");
          queryClient.invalidateQueries({ queryKey: ["my-info"] });
          setIsEditModalVisible(false);
        },
        onError: (error) => {
          message.error("Failed to update profile");
          console.error("Update error:", error);
        },
      }
    );
  };

  if (isLoading || !user || !playlists) {
    return (
      <ProfileContainer>
        <Spin size="large" />
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <UserInfoSection>
        <UserAvatar
          icon={<UserOutlined />}
          src={
            "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          }
        />
        <UserDetails>
          <Title level={2}>{user.username}</Title>
          <Text type="secondary">{user.email}</Text>
          {user.phone && (
            <Text type="secondary" style={{ display: "block" }}>
              Phone: {user.phone}
            </Text>
          )}
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={showEditModal}
            >
              Edit Profile
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => setIsPasswordModalVisible(true)}
            >
              Change Password
            </Button>
            <Button danger style={{ marginLeft: 8 }} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </UserDetails>
      </UserInfoSection>

      <PlaylistsSection>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={3}>My Playlists</Title>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <Spin size="large" />
          </div>
        ) : playlists.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <Empty description="You haven't created any playlists yet." />
          </div>
        ) : (
          <PlaylistGrid>
            {playlists.map((playlist) => (
              <StyledCard
                key={playlist._id}
                hoverable
                cover={
                  <PlaylistImage
                    src={playlist.songs[0]?.thumbnail}
                    alt={playlist.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/200x200?text=No+Image";
                    }}
                  />
                }
                onClick={() => navigate(`/playlist/${playlist._id}`)}
              >
                <Card.Meta
                  title={playlist.name}
                  description={`${playlist.songs?.length || 0} songs`}
                />
              </StyledCard>
            ))}
          </PlaylistGrid>
        )}
      </PlaylistsSection>

      <HistorySection>
        <Title level={3}>My History</Title>
        {isHistoryLoading ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <Spin size="large" />
          </div>
        ) : history?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px" }}>
            <Empty description="You haven't listened to any songs yet." />
          </div>
        ) : (
          <HistoryList>
            {history?.map((item) => (
              <HistoryItem key={item._id}>
                <HistoryImage src={item.song?.thumbnail} />
                <SongInfo>
                  <Title level={4}>{item.song?.title}</Title>
                  <Text type="secondary">{formatDate(item.createdAt)}</Text>
                </SongInfo>
              </HistoryItem>
            ))}
          </HistoryList>
        )}
      </HistorySection>

      <Modal
        title="Edit Profile"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditProfile}>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 3, message: "Username must be at least 3 characters!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating} block>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={(values) => {
            changePassword(values, {
              onSuccess: () => {
                message.success("Password changed successfully");
                setIsPasswordModalVisible(false);
                passwordForm.resetFields();
              },
              onError: () => {
                message.error("Failed to change password");
              },
            });
          }}
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isPending}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ProfileContainer>
  );
};
