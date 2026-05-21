import AttendanceRecord from './AttendanceRecord';

function AttendanceList({ records, loadData }) {
  if (records.length === 0) {
    return (
      <div className="empty-state-box">
        <span className="empty-state-icon">📭</span>
        <p>No attendance records yet.</p>
        <p className="empty-state-sub">Log an entry using the form above.</p>
      </div>
    );
  }

  return (
    <ul className="record-list">
      {records.map((record) => (
        <AttendanceRecord
          key={record.record_id}
          record={record}
          loadData={loadData}
        />
      ))}
    </ul>
  );
}

export default AttendanceList;
