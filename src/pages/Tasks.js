import { useEffect, useState, useCallback, useRef } from "react";
import API from "../api/api";
import "./tasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: ""
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(false);

  const hasMounted = useRef(false);

  // ==========================
  // FETCH PROJECTS
  // ==========================
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);

      if (res.data.length > 0) {
        setSelectedProject(res.data[0]._id);
      }
    } catch (err) {
      console.log("Project fetch error:", err);
    }
  };

  // ==========================
  // FETCH USERS
  // ==========================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  // ==========================
  // FETCH TASKS
  // ==========================
  const fetchTasks = useCallback(async () => {
    if (!selectedProject) return;

    try {
      setLoading(true);
      const res = await API.get(`/tasks?projectId=${selectedProject}`);
      setTasks(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // INITIAL LOAD
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // SAFE FETCH (NO ESLINT ERROR)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    fetchTasks();
  }, [selectedProject, fetchTasks]);

  // ==========================
  // CREATE TASK
  // ==========================
  const createTask = async () => {
    if (!form.title.trim()) {
      alert("Title required ⚠️");
      return;
    }

    if (!selectedProject) {
      alert("Select project first ⚠️");
      return;
    }

    try {
      await API.post("/tasks", {
        ...form,
        projectId: selectedProject
      });

      setForm({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        assignedTo: ""
      });

      fetchTasks();
    } catch (err) {
      console.log("Create error:", err);
      alert("Error creating task ❌");
    }
  };

  // ==========================
  // UPDATE STATUS
  // ==========================
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  // ==========================
  // DELETE TASK
  // ==========================
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ==========================
  // FILTER + SEARCH + SORT
  // ==========================
  let filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  if (filter !== "all") {
    filtered = filtered.filter((t) => t.status === filter);
  }

  filtered.sort((a, b) =>
    sort === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="tasks-container">

      <h1>📋 Task Manager</h1>

      <select
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <div className="task-form">

        <input
          placeholder="Task Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          value={form.dueDate}
          onChange={(e) =>
            setForm({ ...form, dueDate: e.target.value })
          }
        />

        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={form.assignedTo}
          onChange={(e) =>
            setForm({ ...form, assignedTo: e.target.value })
          }
        >
          <option value="">Assign User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <button onClick={createTask}>Add</button>

      </div>

      <div className="controls">
        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("todo")}>Todo</button>
        <button onClick={() => setFilter("in-progress")}>In Progress</button>
        <button onClick={() => setFilter("done")}>Done</button>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : filtered.length === 0 ? (
        <p className="empty">No tasks found</p>
      ) : (
        <div className="task-grid">
          {filtered.map((task) => (
            <div key={task._id} className="task-card">

              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <p>Priority: {task.priority}</p>

              <p>
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toDateString()
                  : "N/A"}
              </p>

              <p>👤 {task.assignedTo?.name || "Unassigned"}</p>

              <p>Status: {task.status}</p>

              <div className="actions">
                <button onClick={() => updateStatus(task._id, "in-progress")}>
                  Start
                </button>

                <button onClick={() => updateStatus(task._id, "done")}>
                  Done
                </button>

                <button onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}