import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import HeaderLanding from "../header";

const { Content } = Layout;

const LayoutWrapper = styled(Layout)`
  min-height: 100vh;
  background-color: #fff;
  background-image: url("/landing-page.jpg");
  background-size: cover;
  background-position: center;
`;

const MainLayout = () => {
  return (
    <LayoutWrapper>
      <HeaderLanding />
      <Content style={{ padding: "0px 20px" }}>
        <Outlet />
      </Content>
    </LayoutWrapper>
  );
};

export default MainLayout;
