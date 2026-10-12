// One shared axios "phone line" to the backend, so every file talks to the
// same address and automatically attaches the login token when we have one.
import axios from "axios";

const productionApiBaseUrl = "https://tarang-api.onrender.com/api";
const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim();
const isLoopbackApiUrl = (value) => {
  try {
    return ["localhost", "127.0.0.1", "::1"].includes(new URL(value).hostname.toLowerCase());
  } catch {
    return false;
  }
};
const apiBaseUrl = import.meta.env.PROD && (!configuredApiBaseUrl || isLoopbackApiUrl(configuredApiBaseUrl))
  ? productionApiBaseUrl
  : configuredApiBaseUrl;

const api = axios.create({
  baseURL: apiBaseUrl?.replace(/\/$/, ""),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tarang_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
