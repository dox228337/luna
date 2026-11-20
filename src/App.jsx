import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { MusicProvider } from './context/MusicContext';
import DiscoverPage from './pages/DiscoverPage';
import FavoritesPage from './pages/FavoritesPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistPage from './pages/PlaylistPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DiscoverPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="playlists" element={<PlaylistsPage />} />
        <Route path="playlists/:playlistId" element={<PlaylistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MusicProvider>
        <AppRoutes />
      </MusicProvider>
    </BrowserRouter>
  );
}
