import { useState } from "react";

export default function Login({ setUser, setRole, setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setLocalRole] = useState("Student");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ VERY IMPORTANT FIX
      setUser(data.username);
      setRole(data.role); // 🔥 MUST be from backend
      setPage("dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select onChange={(e) => setLocalRole(e.target.value)}>
        <option>Student</option>
        <option>Teacher</option>
      </select>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}