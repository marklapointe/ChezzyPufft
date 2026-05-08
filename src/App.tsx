import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage, HomePage, MoviesPage, TVShowsPage, MusicPage, LiveTVPage, SettingsPage, ItemDetailPage, SeriesDetail, SeasonDetail } from './pages';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/tv" element={<TVShowsPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/livetv" element={<LiveTVPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/season/:id" element={<SeasonDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
