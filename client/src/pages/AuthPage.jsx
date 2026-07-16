import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/forms/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState(null);
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setError(null);
    try {
      if (mode === 'login') {
        await login(values);
      } else {
        await register(values);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden font-body px-4 py-8">
      {/* Cinematic Background Video */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-black/65 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover animate-ken-burns scale-105"
          poster="https://placehold.co/1920x1080/0a0a0a/ff6b00?text=Anime+Fantasy+Background"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Centered Glass Card */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/55 p-8 shadow-[0_0_50px_rgba(255,107,0,0.15)] backdrop-blur-2xl transition-all duration-300 hover:border-white/20">
          <div className="mb-8 text-center select-none">
            {/* Premium Glowing Logo */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-red-500 shadow-lg shadow-primary/30 animate-pulse-slow">
              <svg className="h-9 w-9 text-black drop-shadow-[0_1px_4px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h1 className="font-righteous text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-red-500 drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]">
              XENOSTREAM
            </h1>
            <h2 className="mt-4 font-display text-2xl font-bold text-white tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Join the Stream'}
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {mode === 'login'
                ? 'Enter your credentials to access your stream.'
                : 'Start your journey into the world of anime.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 animate-fade-in rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-start gap-2.5">
              <svg className="h-5 w-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <AuthForm mode={mode} onSubmit={handleSubmit} loading={loading} />

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode((prev) => (prev === 'login' ? 'register' : 'login'));
                setError(null);
              }}
              className="text-sm font-medium text-white/60 transition-colors duration-200 hover:text-primary cursor-pointer outline-none focus-visible:text-primary"
            >
              {mode === 'login' ? (
                <>
                  New here? <span className="text-primary hover:underline underline-offset-4 decoration-primary transition-all duration-200 font-semibold">Create an account</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="text-primary hover:underline underline-offset-4 decoration-primary transition-all duration-200 font-semibold">Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-white/40">
          <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
