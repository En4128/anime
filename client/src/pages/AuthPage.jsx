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
    <div className="relative flex min-h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden">
      {/* Cinematic Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover animate-ken-burns"
          poster="https://placehold.co/1920x1080/0a0a0a/ff6b00?text=Anime+Fantasy+Background"
        >
          <source src="/public/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Centered Glass Card */}
      <div className="relative z-10 w-full max-w-md p-4 animate-slide-up">
        <div className="glass overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow animate-pulse-slow" />
            <h1 className="font-display text-3xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Join XenoStream'}
            </h1>
            <p className="mt-2 text-sm text-white/60">
              {mode === 'login'
                ? 'Enter your credentials to access your account.'
                : 'Start your journey into the world of anime.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 animate-fade-in rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
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
              className="text-sm font-medium text-white/60 transition hover:text-primary"
            >
              {mode === 'login' ? (
                <>
                  New here? <span className="text-primary underline decoration-transparent transition-all hover:decoration-primary">Create an account</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="text-primary underline decoration-transparent transition-all hover:decoration-primary">Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-white/40">
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
