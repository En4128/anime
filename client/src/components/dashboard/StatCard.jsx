const StatCard = ({ label, value, delta }) => (
  <div className="rounded-2xl border border-white/5 bg-secondary/40 p-6">
    <p className="text-sm uppercase tracking-wide text-white/60">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    {delta && <p className="text-xs text-primary">{delta}</p>}
  </div>
);

export default StatCard;

