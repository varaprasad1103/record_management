import { useState } from "react";
import Signup from "./Signup";
import "../styles/Auth.css";

function Login({ onLogin }) {
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      localStorage.setItem("loggedIn", "true");
      onLogin();
    } else {
      alert("Invalid username or password");
    }
  };

  if (showSignup) {
    return <Signup onBackToLogin={() => setShowSignup(false)} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          New user?{" "}
          <span className="auth-link" onClick={() => setShowSignup(true)}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
