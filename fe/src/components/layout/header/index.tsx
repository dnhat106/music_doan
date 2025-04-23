import { Menu, Button, Layout, Avatar, Popover } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useMemo } from "react";
import { SearchBar } from "../../landing";
import { useUserInfo } from "../../../hook/auth/useUserInfo";

const { Header } = Layout;

const HeaderWrapper = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  padding: 0 24px;
`;

const Branding = styled.div`
  font-family: "Playfair Display", serif;
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  cursor: pointer;
`;

const MenuLanding = styled(Menu)`
  background-color: transparent;
  width: 40%;
  display: flex;
  justify-content: space-evenly;
  border-bottom: none;
  font-size: 16px;
`;

const ButtonSignUp = styled(Button)`
  color: #ffb30e;
  border: none;
  &:hover {
    color: black !important;
  }
`;

const AuthWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  transition: all 0.3s ease;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: transparent !important;
  }
`;

const PopoverContent = styled.div`
  width: 200px;
  background-color: white;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
`;

const PopoverButton = styled(Button)`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: none;
  background: transparent;

  &:hover {
    background-color: #ffb30e !important;
    color: black !important;
  }
`;

const SignOutButton = styled(PopoverButton)`
  margin-top: 10px;
  color: red;
`;

const menuItems = [
  { key: "1", label: "Home" },
  { key: "2", label: "Album" },
  { key: "3", label: "Artist" },
];

const HeaderLanding = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: user } = useUserInfo();
  const handleSignIn = () => navigate("/login");
  const handleSignUp = () => navigate("/signup");
  const handleProfile = () => navigate("/profile");
  const handleAdminDashboard = () => navigate("/admin");
  const handleMenuClick = (key: string) => {
    if (key === "1") {
      navigate("/");
    } else if (key === "2") {
      navigate("/albums");
    } else if (key === "3") {
      navigate("/artists");
    }
  };

  const popoverContent = useMemo(() => {
    if (!user) {
      return (
        <PopoverContent>
          <SectionTitle>Welcome!</SectionTitle>
          <PopoverButton onClick={handleSignIn}>Sign In</PopoverButton>
          <PopoverButton onClick={handleSignUp}>Sign Up</PopoverButton>
        </PopoverContent>
      );
    }

    return (
      <PopoverContent>
        <SectionTitle>Hello, {user.username || "User"}!</SectionTitle>
        <PopoverButton onClick={handleProfile}>Profile</PopoverButton>
        {user.adminId && (
          <PopoverButton onClick={handleAdminDashboard}>
            Admin Dashboard
          </PopoverButton>
        )}
        <SignOutButton onClick={logout}>Sign Out</SignOutButton>
      </PopoverContent>
    );
  }, [user]);

  const renderAuthArea = useMemo(() => {
    if (!user) {
      return (
        <AuthWrapper>
          <ButtonSignUp shape="round" onClick={handleSignUp}>
            <b>Sign Up</b>
          </ButtonSignUp>
          <Button type="text" shape="round" onClick={handleSignIn}>
            <b>Sign In</b>
          </Button>
        </AuthWrapper>
      );
    }

    return (
      <Popover content={popoverContent} trigger="click" placement="bottomRight">
        <ProfileBox>
          <Avatar
            src={
              "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            size={30}
          />
          <span style={{ marginLeft: 8, color: "#000", fontWeight: 500 }}>
            {user.username || "User"}
          </span>
        </ProfileBox>
      </Popover>
    );
  }, [user, popoverContent]);

  return (
    <HeaderWrapper>
      <Branding onClick={() => navigate("/")}>Spotifo</Branding>
      <SearchBar />
      <MenuLanding
        mode="horizontal"
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
      />
      {renderAuthArea}
    </HeaderWrapper>
  );
};

export default HeaderLanding;
