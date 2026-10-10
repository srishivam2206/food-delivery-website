import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-box">
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>

      <form onSubmit={handleSubmit} className="panel">
        {mode === "register" && (
          <>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </>
        )}

        <label className="label" htmlFor="email">Email</label>
        <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="btn btn-big" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
        </button>
      </form>

      <p className="muted center">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <button className="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Create an account" : "Login"}
        </button>
      </p>
    </section>
  );
}
