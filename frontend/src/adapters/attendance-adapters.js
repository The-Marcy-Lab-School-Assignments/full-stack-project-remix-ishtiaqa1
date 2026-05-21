const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllRecords = async (class_id = null) => {
  const url = class_id ? `/api/attendance?class_id=${class_id}` : '/api/attendance';
  return handleFetch(url);
};

export const fetchStats = async () => {
  return handleFetch('/api/attendance/stats');
};

export const createRecord = async (class_id, date, status, notes) => {
  return handleFetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ class_id, date, status, notes }),
  });
};

export const updateRecord = async (record_id, updates) => {
  return handleFetch(`/api/attendance/${record_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteRecord = async (record_id) => {
  return handleFetch(`/api/attendance/${record_id}`, { method: 'DELETE' });
};
