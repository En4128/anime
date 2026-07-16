import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse' },
  { to: '/watchlist', label: 'Watchlist' },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  // Scroll-aware background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-500">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-2.5 transition-all duration-500 ${
            scrolled
              ? 'border border-white/10 bg-black/70 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl'
              : 'border border-transparent bg-black/30 backdrop-blur-md'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5 cursor-pointer select-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-red-500 shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-primary/40">
              <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="font-righteous text-xl tracking-wider">
              <span className="text-white transition-colors duration-300 group-hover:text-white/80">XENO</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">STREAM</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-[13px] font-semibold uppercase tracking-widest transition-all duration-300 rounded-lg cursor-pointer ${
                    isActive
                      ? 'text-primary'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {/* Active dot indicator */}
                    <span
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                {/* User Profile */}
                <Link
                  to="/profile"
                  className="group flex items-center gap-2.5 rounded-xl px-3 py-1.5 transition-all duration-300 hover:bg-white/[0.04] cursor-pointer"
                >
                  <div className="relative">
                    <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-primary/40 transition-all duration-300 group-hover:ring-primary/70 group-hover:shadow-[0_0_12px_rgba(255,107,0,0.3)]">
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-secondary text-xs font-bold text-primary">
                        {user?.username?.[0]?.toUpperCase()}
                      </div>
                    </div>
                    {/* Online indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-emerald-400" />
                  </div>
                  <span className="hidden text-sm font-medium text-white/70 transition-colors duration-200 group-hover:text-white lg:block">
                    {user?.username}
                  </span>
                </Link>

                {/* Admin Badge */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20 transition-all duration-300 hover:bg-primary/20 hover:ring-primary/40 cursor-pointer"
                  >
                    Admin
                  </Link>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-white/10 px-4 py-1.5 text-[13px] font-medium text-white/50 transition-all duration-300 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5 cursor-pointer active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2 text-sm font-bold text-black shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition-all duration-300 hover:bg-white/5 hover:border-white/20 md:hidden cursor-pointer active:scale-90"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`absolute left-0 top-full mt-2 w-full origin-top px-4 transition-all duration-300 ease-out ${
            open
              ? 'scale-y-100 opacity-100 translate-y-0'
              : 'scale-y-95 opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col p-5 gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          isActive ? 'bg-primary' : 'bg-white/20'
                        }`}
                      />
                      {link.label}
                    </>
                  )}
                </NavLink>
              ))}

              <div className="my-2 h-px w-full bg-white/[0.06]" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/[0.04] hover:text-white cursor-pointer"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-secondary text-xs font-bold text-primary ring-1 ring-primary/30">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <span>{user?.username}</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="ml-4 mr-4 rounded-lg bg-primary/10 px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/20 transition hover:bg-primary/20 cursor-pointer"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mx-4 mt-1 rounded-xl border border-red-500/20 py-2.5 text-center text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="mx-4 mt-1 rounded-xl bg-gradient-to-r from-primary to-accent py-2.5 text-center text-sm font-bold text-black cursor-pointer"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
