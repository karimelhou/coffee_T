const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function apiRequest(path, options = {}) {
  const { headers = {}, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch (error) {
      // ignore JSON parsing errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchMenu(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiRequest(`/menu${query}`, { method: 'GET' });
}

export function fetchCategories() {
  return apiRequest('/menu/categories', { method: 'GET' });
}

export function calculateCart(items) {
  return apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

export function createOrder(payload) {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function adminCreateMenuItem(payload, token) {
  return apiRequest('/menu', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function adminDeleteMenuItem(id, token) {
  return apiRequest(`/menu/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
}

export function adminFetchOrders(token) {
  return apiRequest('/orders', {
    method: 'GET',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
}

export const apiHelpers = {
  buildBasicToken(username, password) {
    return btoa(`${username}:${password}`);
  },
  baseUrl: API_BASE_URL,
};
