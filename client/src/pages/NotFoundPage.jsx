import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="mx-auto max-w-xl rounded-3xl border border-white/5 bg-secondary/40 p-10 text-center">
    <p className="text-xs uppercase tracking-[0.3em] text-primary">404</p>
    <h1 className="mt-4 font-display text-4xl">Lost in the multiverse</h1>
    <p className="mt-2 text-white/60">The page you’re looking for warped to another dimension.</p>
    <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-2 font-semibold text-secondary">
      Return Home
    </Link>
  </div>
);

export default NotFoundPage;

