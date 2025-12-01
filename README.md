# ✅ To-do API

A simple REST API for managing tasks built with express for user-specific task management.

## 🚀 Features

- User authentication (JWT-based)
- CRUD for tasks (create, read, update, delete)
- Mark tasks as complete/incomplete

## 🛠 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Postman** for API testing

## 📂 Project Structure

todo/
│ ├── controllers/ # Request handlers
│ ├── models/ # Task & User schemas
│ ├── routes/ # Task & User routes
│ ├── middlewares/ # Auth & error handling
│── .env
│── index.js
│── package.json
│── README.md

## 🔑 Authentication

- `POST /api/users/register`
- `POST /api/users/login`

## 🛠 Installation

```bash
git clone https://github.com/DamiAjele/Todo-API.git
cd todo-api
```

## Running the Application

```bash
npm run start
```

## 🔍 Usage

Example request to create a task:

POST /api/tasks/add-task
Authorization: JWT Token (Login required)
Content-Type: application/json

```bash
{
  "title": "Finish API project",
  "description": "Complete the documentation and upload to GitHub",
  "category": "School",
  "date": "2025-08-25",
  "time": "15:30",
  "completed": false
}
```

## Author

Damilola Ajele
