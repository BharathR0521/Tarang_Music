// One shared axios "phone line" to the backend, so every file talks to the
// same address and automatically attaches the login token when we have one.
import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL;
const apiBaseUrl = configuredApiUrl?.includes("localhost")
  ? "https://tarang-api.onrender.com/api"
  : configuredApiUrl || "https://tarang-api.onrender.com/api";

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tarang_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
