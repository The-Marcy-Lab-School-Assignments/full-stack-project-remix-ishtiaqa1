import { deleteRecord } from '../adapters/attendance-adapters';

const STATUS_META = {
  present: { label: 'Present', icon: '✓', cls: 'present' },
  late:    { label: 'Late',    icon: '⏱', cls: 'late' },
  excused: { label: 'Excused', icon: '📝', cls: 'excused' },
  absent:  { label: 'Absent',  icon: '✗',  cls: 'absent' },
};

function AttendanceRecord({ record, loadData }) {
  const meta = STATUS_META[record.status] || STATUS_META.absent;

  const handleDelete = async () => {
    const { error } = await deleteRecord(record.record_id);
    if (error) return console.error(error);
    loadData();
  };

  const displayDate = new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <li className="record-item">
      <span className={`status-badge status-badge--${meta.cls}`}>
        {meta.icon} {meta.label}
      </span>
      <div className="record-info">
        <span className="record-class">{record.class_name}</span>
        <span className="record-date">{displayDate}</span>
        {record.notes && <span className="record-notes">{record.notes}</span>}
      </div>
      <button className="btn-delete-sm" onClick={handleDelete} title="Delete record">✕</button>
    </li>
  );
}

export default AttendanceRecord;
