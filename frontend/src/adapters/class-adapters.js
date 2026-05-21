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

export const fetchAllClasses = async () => {
  return handleFetch('/api/classes');
};

export const createClass = async (name, instructor) => {
  return handleFetch('/api/classes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, instructor }),
  });
};

export const updateClass = async (class_id, updates) => {
  return handleFetch(`/api/classes/${class_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteClass = async (class_id) => {
  return handleFetch(`/api/classes/${class_id}`, { method: 'DELETE' });
};
