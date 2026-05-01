import { useEffect, useState } from "react";
import API from "../api/api";
import "./dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get("/dashboard");
      setData(res.data);

      const taskRes = await API.get("/tasks");
      setTasks(taskRes.data.slice(0, 5));

    } catch (err) {
      console.log(err);
      alert("Error loading dashboard ❌");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <h1>📊 Dashboard</h1>

        <button className="refresh-btn" onClick={fetchDashboard}>
          🔄 Refresh
        </button>
      </div>

      {/* CARDS */}
      <div className="cards">

        <Card title="Total Tasks" value={data.totalTasks} color="blue" icon="📋" />
        <Card title="Completed" value={data.completedTasks} color="green" icon="✅" />
        <Card title="Pending" value={data.pendingTasks} color="yellow" icon="⏳" />
        <Card title="In Progress" value={data.inProgressTasks} color="purple" icon="🚧" />
        <Card title="Overdue" value={data.overdueTasks} color="red" icon="⚠️" />

      </div>

      {/* RECENT TASKS */}
      <div className="recent">

        <h2>🕒 Recent Tasks</h2>

        {tasks.length === 0 ? (
          <p className="empty">No tasks available</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-item">

                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>

                <span className={`badge ${task.status}`}>
                  {task.status}
                </span>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

// CARD COMPONENT
function Card({ title, value, color, icon }) {
  return (
    <div className={`card ${color}`}>
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}