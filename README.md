# 🚀 Team Task Manager (MERN Stack)

A full-stack Task Management Web Application where users can create projects, assign tasks, and track progress with role-based access (Admin / Member).

---

## 🌐 Live Demo

* 🔗 Frontend: https://taskmanager-frontend-i5cm.vercel.app/
* 🔗 Backend: https://backendtaskapp-1.onrender.com

---

## 📌 Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Protected routes

### 📁 Project Management

* Create and manage projects
* Select project to view tasks

### 👥 Team Management

* Assign tasks to users
* View assigned user

### 📋 Task Management

* Create, update, delete tasks
* Set priority (Low / Medium / High)
* Add due date
* Change task status (Todo → In Progress → Done)

### 📊 Dashboard

* Total tasks
* Completed tasks
* Pending tasks
* In-progress tasks
* Overdue tasks

---

## 🛠 Tech Stack

### Frontend

* React.js
* CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB (NoSQL)

---

## ⚙️ Installation (Local Setup)

### 1. Clone repo

```bash
git clone https://github.com/abhi-148/taskmanager-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start app

```bash
npm start
```

---

## 🔐 Environment Variables (Backend)

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 📦 API Endpoints

* POST /api/auth/signup
* POST /api/auth/login
* GET /api/tasks
* POST /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id
* GET /api/projects

---

## 📽 Demo Video
(https://drive.google.com/file/d/1SbCmQ7PrqQc7MrT59CpTcodhFk0P6t2v/view?usp=sharing))

---

## 👨‍💻 Author

Abhishek Kumar
GitHub: https://github.com/abhi-148
