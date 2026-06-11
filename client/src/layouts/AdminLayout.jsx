import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      <header className="border-b border-white/5 bg-secondary/80 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-xl text-primary">
            XenoStream Admin
          </Link>
          <div className="text-sm text-white/80">{user?.email}</div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8">
        <aside className="hidden w-60 flex-col gap-4 rounded-2xl border border-white/5 bg-secondary/50 p-4 md:flex">
          <Link to="/admin" className="text-white/80 hover:text-primary">
            Dashboard
          </Link>
          <Link to="/admin/anime" className="text-white/80 hover:text-primary">
            Anime Manager
          </Link>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;

