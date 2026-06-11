import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/watchlist', label: 'Watchlist' },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-6 py-3 shadow-glass">
        <Link to="/" className="group flex items-center gap-2 font-display text-xl text-white transition hover:text-primary">
          <span className="font-bold tracking-wide group-hover:animate-pulse">Xeno<span className="text-primary">Stream</span></span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative text-sm font-medium uppercase tracking-wide transition-colors duration-300 hover:text-primary ${isActive ? 'text-primary' : 'text-white/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-primary">
                <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-surface">
                  {/* Placeholder avatar if needed, or just initials */}
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary text-xs text-primary">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                </div>
                <span className="hidden lg:block">{user?.username}</span>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="rounded-full bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-white/10 transition hover:bg-white/5">
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/10 px-5 py-1.5 text-sm font-medium text-white/70 transition hover:border-primary hover:text-primary hover:shadow-glow"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:shadow-glow hover:scale-105">
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`absolute left-0 top-full mt-2 w-full origin-top transform px-4 transition-all duration-300 ${open ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
          <div className="glass flex flex-col gap-4 rounded-2xl p-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-white/70'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="h-px w-full bg-white/10" />
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="text-sm text-white/80">
                  Profile ({user?.username})
                </Link>
                <button type="button" onClick={handleLogout} className="text-left text-sm text-red-400">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-center rounded-full bg-primary py-2 text-sm font-bold text-white">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

