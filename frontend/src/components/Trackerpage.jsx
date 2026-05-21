import { useState, useEffect } from 'react';
import { fetchAllClasses } from '../adapters/class-adapters';
import { fetchAllRecords, fetchStats } from '../adapters/attendance-adapters';
import ClassList from './ClassList';
import AddRecordForm from './AddRecordForm';
import AttendanceList from './AttendanceList';
import StatsBar from './StatsBar';

function TrackerPage({ currentUser, handleLogout }) {
  const [classes, setClasses] = useState([]);
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClasses = async () => {
    const { data, error: err } = await fetchAllClasses();
    if (!err) setClasses(data);
  };

  const loadRecords = async () => {
    const { data, error: err } = await fetchAllRecords(selectedClassId);
    if (!err) setRecords(data);
  };

  const loadStats = async () => {
    const { data, error: err } = await fetchStats();
    if (!err) setStats(data);
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([loadClasses(), loadRecords(), loadStats()]);
    } catch (e) {
      setError('Something went wrong loading your data.');
    }
    setIsLoading(false);
  };

  useEffect(() => { loadRecords(); }, [selectedClassId]);

  useEffect(() => { loadData(); }, []);

  const handleSelectClass = (class_id) => setSelectedClassId(class_id);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-icon">📋</span>
          <span className="topbar-title">AttendanceIQ</span>
        </div>
        <div className="topbar-user">
          <span>👋 {currentUser.username}</span>
          <button className="btn-logout" onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ClassList
            classes={classes}
            loadClasses={() => { loadClasses(); loadStats(); }}
            selectedClassId={selectedClassId}
            onSelectClass={handleSelectClass}
          />
        </aside>

        <main className="content-area">
          <StatsBar stats={stats} />

          <AddRecordForm
            classes={classes}
            selectedClassId={selectedClassId}
            loadData={loadData}
          />

          <div className="records-section">
            <div className="records-header">
              <h3>
                {selectedClassId
                  ? `Records — ${classes.find(c => c.class_id === selectedClassId)?.name || ''}`
                  : 'All Records'}
              </h3>
              <span className="record-count">{records.length} entries</span>
            </div>
            {isLoading && <p className="loading-msg">Loading…</p>}
            {error && <p className="error">{error}</p>}
            <AttendanceList records={records} loadData={loadData} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default TrackerPage;
