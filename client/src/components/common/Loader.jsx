const Loader = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center py-10 text-white/70">
    <div className="flex items-center gap-3">
      <span className="h-3 w-3 animate-ping rounded-full bg-primary" />
      <span>{message}</span>
    </div>
  </div>
);

export default Loader;

