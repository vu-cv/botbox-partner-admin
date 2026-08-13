import axios from '@crema/services/axios';
import type {AxiosResponse} from 'axios';
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from './tokenKeys';

const jwtAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token');
  }
  const {data: body} = await axios.create({baseURL: import.meta.env.VITE_API_URL as string}).post(
    '/partner/auth/refresh-token',
    {refreshToken},
  );
  const {accessToken, refreshToken: newRefreshToken} = body.data;
  setAuthToken(accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  return accessToken;
};

jwtAxios.interceptors.response.use(
  (res: AxiosResponse<any, any>) => res,
  async (err: any) => {
    const originalRequest = err.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/partner/auth/');

    if (err.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshPromise = refreshPromise || refreshAccessToken();
        const accessToken = await refreshPromise;
        refreshPromise = null;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return jwtAxios(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setAuthToken();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);
export const setAuthToken = (token?: string) => {
  if (token) {
    jwtAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete jwtAxios.defaults.headers.common.Authorization;
  }
};

export default jwtAxios;
