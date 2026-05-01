import { useEffect, useState } from "react";
import API from "../api/api";
import "./projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  // 🔹 FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      alert("Error loading projects ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 🔹 CREATE PROJECT
  const createProject = async () => {
    if (!form.name) {
      alert("Project name required ⚠️");
      return;
    }

    try {
      await API.post("/projects", form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      alert("Error creating project ❌");
    }
  };

  return (
    <div className="projects-container">

      {/* HEADER */}
      <div className="projects-header">
        <h1>📁 Project Manager</h1>
      </div>

      {/* CREATE PROJECT */}
      <div className="project-form">

        <input
          placeholder="Project Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button onClick={createProject}>➕ Create</button>
      </div>

      {/* PROJECT LIST */}
      {loading ? (
        <div className="loader"></div>
      ) : projects.length === 0 ? (
        <p className="empty">No projects found</p>
      ) : (
        <div className="project-grid">

          {projects.map((p) => (
            <div key={p._id} className="project-card">

              <h3>{p.name}</h3>
              <p>{p.description || "No description"}</p>

              <div className="meta">
                <span>👥 {p.members?.length || 1} Members</span>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}