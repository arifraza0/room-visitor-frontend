
import { useState } from "react";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        alert("Login successful!");

        onLogin();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Backend se connection nahi ho raha!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-icon">
          🔐
        </div>

        <h2>Admin Login</h2>

        <p className="login-subtitle">
          Login to access the visitor dashboard
        </p>

        <form onSubmit={handleSubmit}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>

        </form>

        <p className="login-footer">
          Admin access only
        </p>

      </div>
    </div>
  );
}

export default AdminLogin;

