// Keeps track of "who is logged in" across the whole app.
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tarang_token");
    const savedUser = localStorage.getItem("tarang_user");
    if (token && savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const { data } = await api.post("/auth/login", { username: identifier, email: identifier, password });
    localStorage.setItem("tarang_token", data.token);
    localStorage.setItem("tarang_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, username, email, password, favoriteGenres) => {
    const { data } = await api.post("/auth/register", { name, username, email, password, favoriteGenres });
    localStorage.setItem("tarang_token", data.token);
    localStorage.setItem("tarang_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("tarang_token");
    localStorage.removeItem("tarang_user");
    setUser(null);
  };

  const updateProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    const { data } = await api.post("/auth/profile-image", formData);
    localStorage.setItem("tarang_user", JSON.stringify({ ...user, ...data }));
    setUser((current) => ({ ...current, ...data }));
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
