import { useState } from "react";
import "../styles/Auth.css";

function Signup({ onBackToLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "ADMIN"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Signup successful");
      onBackToLogin();
    } else {
      alert("Signup failed");
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

        <button onClick={handleSubmit}>Register</button>

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
