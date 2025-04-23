import { Layout, Spin } from "antd";
import styled from "styled-components";
import { SectionListMusic } from "../components/landing";
import { LibrarySider } from "../components/layout/sider";
import { useAllSongs } from "../hook/song/useAllSongs";
const { Content } = Layout;

const Wrapper = styled.div`
  background-color: rgba(240, 242, 245, 0.5);
  min-height: 90vh;
  padding-bottom: 100px;
`;

const CustomLayout = styled(Layout)`
  background-color: transparent !important;
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const CustomContent = styled(Content)`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0px 24px 24px 24px;
  box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 80px);
  overflow-y: auto;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const LandingPage = () => {
  const { data, isLoading } = useAllSongs();

  if (isLoading || !data) {
    return (
      <Wrapper>
        <Spin size="large" />
      </Wrapper>
    );
  }
  const songTrending = data
    .sort((song1, song2) => song2.playCount - song1.playCount)
    .slice(0, 5);
    
  return (
    <Wrapper>
      <CustomLayout>
        <LibrarySider />
        <CustomContent>
          <SectionListMusic playlistName="Trending" songs={songTrending} />
          <SectionListMusic songs={data} />
        </CustomContent>
      </CustomLayout>
    </Wrapper>
  );
};

export default LandingPage;
