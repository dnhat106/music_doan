import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, ProfilePage, RegisterPage } from "../pages";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import LandingPage from "../pages/LandingPage";
import MainLayout from "../components/layout/mainLayout";
import { PlaylistPage } from "../pages/PlaylistPage";
import AdminPage from "../pages/admin/AdminPage";
import AlbumListPage from "../pages/AlbumListPage";
import AlbumDetailPage from "../pages/AlbumDetailPage";
import SongDetailPage from "../pages/SongDetailPage";
import { useAuth } from "../context/AuthContext";
import ArtistListPage from "../pages/ArtistListPage";
import ArtistDetailPage from "../pages/ArtistDetailPage";

const RootRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <RegisterPage />} />

      <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/albums" element={<AlbumListPage />} />
          <Route path="/artists" element={<ArtistListPage />} />
          <Route path="/artist/:artistId" element={<ArtistDetailPage />} />
          <Route path="/album/:albumId" element={<AlbumDetailPage />} />
          <Route path="/song/:songId" element={<SongDetailPage />} />
          <Route path="/landing2" element={<ProtectedRoute element={<LandingPage />} />} />
          <Route path="/playlist/:playlistId" element={<ProtectedRoute element={<PlaylistPage />} />} />
          <Route path="/admin" element={<AdminRoute element={<AdminPage />} />} />
      </Route>

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default RootRoutes;
