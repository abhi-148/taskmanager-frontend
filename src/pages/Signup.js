import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required ⚠️");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        ...form,
        role: "member"
      });

      alert("Signup Successful ✅");
      navigate("/");

    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">

      <div className="signup-card">

        <h2>🚀 Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>

        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>

      </div>

    </div>
  );
}