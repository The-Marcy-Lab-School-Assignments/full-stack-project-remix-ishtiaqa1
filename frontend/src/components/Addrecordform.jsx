import { useState } from 'react';
import { createRecord } from '../adapters/attendance-adapters';

const STATUS_OPTIONS = [
  { value: 'present', label: '✓ Present', color: 'present' },
  { value: 'late',    label: '⏱ Late',    color: 'late' },
  { value: 'excused', label: '📝 Excused', color: 'excused' },
  { value: 'absent',  label: '✗ Absent',  color: 'absent' },
];

function AddRecordForm({ classes, selectedClassId, loadData }) {
  const today = new Date().toISOString().split('T')[0];
  const [classId, setClassId] = useState(selectedClassId || '');
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState('present');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  if (selectedClassId && classId !== selectedClassId) {
    setClassId(selectedClassId);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId) { setError('Please select a class.'); return; }
    const { error: err } = await createRecord(Number(classId), date, status, notes || null);
    if (err) { setError(err.message); return; }
    setNotes('');
    setError(null);
    loadData();
  };

  return (
    <form className="add-record-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Log Attendance</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rec-class">Class</label>
          <select
            id="rec-class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="">Select a class…</option>
            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="rec-date">Date</label>
          <input
            type="date"
            id="rec-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Status</label>
        <div className="status-pills">
          {STATUS_OPTIONS.map((opt) => (
            <label key={opt.value} className={`status-pill status-pill--${opt.color} ${status === opt.value ? 'status-pill--active' : ''}`}>
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={status === opt.value}
                onChange={() => setStatus(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="rec-notes">Notes (optional)</label>
        <input
          type="text"
          id="rec-notes"
          placeholder="e.g. Doctor appointment, bus delay…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn-primary">Log Entry</button>
    </form>
  );
}

export default AddRecordForm;
