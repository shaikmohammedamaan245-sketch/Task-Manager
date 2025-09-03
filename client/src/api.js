
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function getToken() {
  return localStorage.getItem('token');
}
export function setToken(t) {
  localStorage.setItem('token', t);
}

export async function api(path, method='GET', body) {
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: 'Bearer ' + getToken() } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'Request failed'}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}
