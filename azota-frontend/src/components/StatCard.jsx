export default function StatCard({
  title,
  value,
  icon: Icon,
  wide = false,
}) {
  return (
    <div className={`stat-card ${wide ? "stat-card-wide" : ""}`}>
      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <strong className="stat-card-value">{value}</strong>
      </div>

      <Icon
        className="stat-card-icon"
        size={27}
        strokeWidth={1.5}
      />
    </div>
  );
}