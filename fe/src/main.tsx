import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import RootRoutes from "./routes/RootRouter.tsx";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./context/AuthContext.tsx";
import { AudioPlayerProvider } from "./context/AudioPlayerContext.tsx";
import MusicPlayer from "./components/music/player/index.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ConfigProvider>
          <AuthProvider>
            <AudioPlayerProvider>
              <RootRoutes />
              <MusicPlayer />
            </AudioPlayerProvider>
          </AuthProvider>
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
