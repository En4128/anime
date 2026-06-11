import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import BrowsePage from '../pages/BrowsePage.jsx';
import AnimeDetailsPage from '../pages/AnimeDetailsPage.jsx';
import WatchPage from '../pages/WatchPage.jsx';
import WatchlistPage from '../pages/WatchlistPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import AuthPage from '../pages/AuthPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';
import AdminAnimePage from '../pages/AdminAnimePage.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <Loader message="Checking session..." />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, initializing } = useAuth();
  if (initializing) return <Loader message="Checking session..." />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const MainWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AdminWrapper = () => (
  <AdminRoute>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </AdminRoute>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<MainWrapper />}>
      <Route index element={<HomePage />} />
      <Route path="browse" element={<BrowsePage />} />
      <Route path="anime/:slug" element={<AnimeDetailsPage />} />
      <Route
        path="watch/:animeId/:episodeId"
        element={
          <ProtectedRoute>
            <WatchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="watchlist"
        element={
          <ProtectedRoute>
            <WatchlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="auth" element={<AuthPage />} />
    </Route>

    <Route path="admin" element={<AdminWrapper />}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="anime" element={<AdminAnimePage />} />
    </Route>

    <Route
      path="*"
      element={
        <MainLayout>
          <NotFoundPage />
        </MainLayout>
      }
    />
  </Routes>
);

export default AppRoutes;

