import { useState } from 'react';
import { createClass, deleteClass } from '../adapters/class-adapters';

function ClassList({ classes, loadClasses, selectedClassId, onSelectClass }) {
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !instructor.trim()) return;
    const { error: err } = await createClass(name.trim(), instructor.trim());
    if (err) { setError(err.message); return; }
    setName('');
    setInstructor('');
    setShowForm(false);
    setError(null);
    loadClasses();
  };

  const handleDelete = async (class_id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this class and all its attendance records?')) return;
    const { error: err } = await deleteClass(class_id);
    if (err) { setError(err.message); return; }
    if (selectedClassId === class_id) onSelectClass(null);
    loadClasses();
  };

  return (
    <div className="class-panel">
      <div className="panel-header">
        <h3>My Classes</h3>
        <button className="btn-icon" onClick={() => setShowForm((p) => !p)} title="Add class">
          {showForm ? '✕' : '＋'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Class name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary btn-sm">Add Class</button>
        </form>
      )}

      {classes.length === 0 ? (
        <p className="empty-state">No classes yet. Add one above!</p>
      ) : (
        <ul className="class-list">
          <li
            className={`class-item ${!selectedClassId ? 'class-item--active' : ''}`}
            onClick={() => onSelectClass(null)}
          >
            <span className="class-item-icon">🗂</span>
            <span className="class-item-name">All Classes</span>
          </li>
          {classes.map((cls) => (
            <li
              key={cls.class_id}
              className={`class-item ${selectedClassId === cls.class_id ? 'class-item--active' : ''}`}
              onClick={() => onSelectClass(cls.class_id)}
            >
              <span className="class-item-icon">📚</span>
              <div className="class-item-info">
                <span className="class-item-name">{cls.name}</span>
                <span className="class-item-instructor">{cls.instructor}</span>
              </div>
              <button
                className="btn-delete-sm"
                onClick={(e) => handleDelete(cls.class_id, e)}
                title="Delete class"
              >✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClassList;
