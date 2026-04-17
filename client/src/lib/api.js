const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const parseJSON = async (response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const { token, body, isFormData = false, ...rest } = options;
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(rest.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await parseJSON(response);

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const formatCurrency = (value) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
}).format(value || 0);
