import { createContext, useContext, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

function readSaved() {
  try {
    return {
      token: localStorage.getItem("token"),
      user: JSON.parse(localStorage.getItem("user") || "null"),
    };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const saved = readSaved();
  const [token, setToken] = useState(saved.token);
  const [user, setUser] = useState(saved.user);

  function saveSession(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  async function login(email, password) {
    const data = await api("/auth/login", { method: "POST", body: { email, password } });
    saveSession(data);
  }

  async function register(name, email, password) {
    const data = await api("/auth/register", { method: "POST", body: { name, email, password } });
    saveSession(data);
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
