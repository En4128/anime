const SectionTitle = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-end gap-4">
    <div>
      <h2 className="font-display text-2xl">{title}</h2>
      {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default SectionTitle;

