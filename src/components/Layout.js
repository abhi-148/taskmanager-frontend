import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";
import "./layout.css";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({});
  const [taskCount, setTaskCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    fetchCounts();
  }, []);

  // 🔥 FETCH COUNTS
  const fetchCounts = async () => {
    try {
      const [taskRes, projectRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects")
      ]);

      setTaskCount(taskRes.data.length);
      setProjectCount(projectRes.data.length);

    } catch (err) {
      console.log("Count error", err);
    }
  };

  // 🔥 LOGOUT
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.clear();
    navigate("/");
  };

  // 🔥 ACTIVE CLASS HELPER
  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

        {/* TOGGLE */}
        <div className="top">
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
        </div>

        {/* USER */}
        {!collapsed && (
          <div className="user">
            <div className="avatar">👤</div>
            <h3>{user?.name || "User"}</h3>
            <p>{user?.role || "Member"}</p>
          </div>
        )}

        {/* NAV */}
        <nav>

          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <span>📊</span>
            {!collapsed && <span>Dashboard</span>}
          </Link>

          <Link
            to="/tasks"
            className={`nav-link ${isActive("/tasks") ? "active" : ""}`}
          >
            <span>📋</span>
            {!collapsed && <span>Tasks</span>}

            {!collapsed && taskCount > 0 && (
              <span className="badge">{taskCount}</span>
            )}
          </Link>

          <Link
            to="/projects"
            className={`nav-link ${isActive("/projects") ? "active" : ""}`}
          >
            <span>📁</span>
            {!collapsed && <span>Projects</span>}

            {!collapsed && projectCount > 0 && (
              <span className="badge">{projectCount}</span>
            )}
          </Link>

        </nav>

        {/* QUICK ACTION */}
        {!collapsed && (
          <button
            className="create-btn"
            onClick={() => navigate("/tasks")}
          >
            ➕ Create Task
          </button>
        )}

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          🚪 {!collapsed && "Logout"}
        </button>

      </div>

      {/* MAIN */}
      <div className="main">
        {children}
      </div>

    </div>
  );
}