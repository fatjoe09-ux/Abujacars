const API_URL = (import.meta.env.VITE_API_URL || 'https://6ae229a2bbb541292299b944.mockapi.io').replace(/\/$/, '');

export async function apiRequest(resource, { method = 'GET', id, data, params } = {}) {
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const url = `${API_URL}/${resource}${id !== undefined ? `/${encodeURIComponent(id)}` : ''}${query}`;
  let response;
  try {
    response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, ...(data !== undefined ? { body: JSON.stringify(data) } : {}) });
  } catch {
    throw new Error('Could not reach your MockAPI.io endpoint. Check your internet connection and API base URL.');
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`MockAPI request failed (${response.status})${detail ? `: ${detail.slice(0, 160)}` : ''}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  get: (resource, params) => apiRequest(resource, { params }),
  getOne: (resource, id) => apiRequest(resource, { id }),
  create: (resource, data) => apiRequest(resource, { method: 'POST', data }),
  update: (resource, id, data) => apiRequest(resource, { method: 'PUT', id, data }),
  patch: (resource, id, data) => apiRequest(resource, { method: 'PATCH', id, data }),
  remove: (resource, id) => apiRequest(resource, { method: 'DELETE', id }),
};
