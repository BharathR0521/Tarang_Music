// One shared axios "phone line" to the backend, so every file talks to the
// same address and automatically attaches the login token when we have one.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tarang_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
