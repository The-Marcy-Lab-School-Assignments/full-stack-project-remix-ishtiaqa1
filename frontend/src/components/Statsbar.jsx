function StatsBar({ stats }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="stats-bar">
      <h3 className="stats-title">Attendance Overview</h3>
      <div className="stats-grid">
        {stats.map((s) => {
          const attended = parseInt(s.present_count) + parseInt(s.late_count);
          const total = parseInt(s.total_count);
          const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
          const colorClass = pct >= 80 ? 'good' : pct >= 60 ? 'warn' : 'bad';

          return (
            <div key={s.class_id} className={`stat-card stat-card--${colorClass}`}>
              <div className="stat-card-header">
                <span className="stat-class-name">{s.class_name}</span>
                <span className={`stat-pct stat-pct--${colorClass}`}>{pct}%</span>
              </div>
              <div className="stat-bar-track">
                <div
                  className={`stat-bar-fill stat-bar-fill--${colorClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="stat-counts">
                <span className="badge badge--present">✓ {s.present_count}</span>
                <span className="badge badge--late">⏱ {s.late_count}</span>
                <span className="badge badge--excused">📝 {s.excused_count}</span>
                <span className="badge badge--absent">✗ {s.absent_count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatsBar;
