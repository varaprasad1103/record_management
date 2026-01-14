import { useState } from "react";
import "../styles/Auth.css";

function Signup({ onBackToLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "ADMIN"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      alert("Username and password required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      alert("Signup successful. Please login.");
      onBackToLogin();
    } catch (err) {
      alert("Signup failed. Username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have account?{" "}
          <span className="auth-link" onClick={onBackToLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
