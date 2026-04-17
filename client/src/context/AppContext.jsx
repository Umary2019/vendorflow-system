import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config';
import { showToast } from '../components/Toast';
import { parseApiError } from '../utils/errorHandler';

const AppContext = createContext(null);

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const buildRequestUrl = (baseUrl, endpoint) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!baseUrl) {
    return normalizedEndpoint;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '');
  let normalizedPath = normalizedEndpoint.replace(/^\/+/, '');

  // Prevent duplicated /api prefix when base is /api and endpoints already include /api/*.
  if (normalizedBase.endsWith('/api') && (normalizedPath === 'api' || normalizedPath.startsWith('api/'))) {
    normalizedPath = normalizedPath.slice(3).replace(/^\/+/, '');
  }

  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : normalizedBase;
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('marketplace_token'));
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('marketplace_theme') || 'light');

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('marketplace_theme', theme);
  }, [theme]);

  const apiFetch = async (endpoint, options = {}) => {
    try {
      const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(buildRequestUrl(API_URL, endpoint), {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  };

  const refreshCartCount = async () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const data = await apiFetch('/api/cart');
      setCartCount(data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(buildRequestUrl(API_URL, '/api/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Session expired');
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem('marketplace_token');
        showToast('Session expired. Please log in again.', 'warning');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  useEffect(() => {
    if (user?.role === 'buyer') {
      refreshCartCount();
    } else {
      setCartCount(0);
    }
  }, [user?.role, token]);

  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('marketplace_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    localStorage.setItem('marketplace_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('marketplace_token');
    setToken(null);
    setUser(null);
    setCartCount(0);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      cartCount,
      theme,
      setTheme,
      login,
      register,
      logout,
      apiFetch,
      refreshCartCount,
      setUser,
      showToast,
    }),
    [user, token, loading, cartCount, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
