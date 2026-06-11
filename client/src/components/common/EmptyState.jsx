const EmptyState = ({ title = 'Nothing here yet', description }) => (
  <div className="rounded-2xl border border-dashed border-white/10 bg-secondary/20 p-8 text-center text-white/60">
    <p className="font-semibold text-white/80">{title}</p>
    {description && <p className="mt-2 text-sm">{description}</p>}
  </div>
);

export default EmptyState;

