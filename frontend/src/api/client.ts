import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// One refresh at a time: if several requests get 401 together, they all wait for the same refresh.
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token');

      // Plain axios, not `client`, so a failed refresh can't trigger another refresh.
      const res = await axios.post<{ access: string; refresh?: string }>(
        `${import.meta.env.VITE_API_URL}/api/auth/token/refresh/`,
        { refresh },
      );
      localStorage.setItem('access_token', res.data.access);
      if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh);
      return res.data.access;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const isTokenRequest = original?.url?.includes('/api/auth/token/');

    if (error.response?.status !== 401 || !original || original._retried || isTokenRequest) {
      return Promise.reject(error);
    }

    original._retried = true;
    try {
      const access = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${access}`;
      return client(original);
    } catch (refreshError) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      return Promise.reject(refreshError);
    }
  },
);

export default client;
