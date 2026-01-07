# Exercises Managing App

**Exercises Managing App** is a web application built with **React** and **Vite**, designed to help users manage and track their exercises.  
The app communicates with a **MySQL database** through a **REST API** built with **Express**, enabling secure and efficient data storage and retrieval.

## Technologies

### Frontend
- **React**
- **Vite**
- **SCSS (Sass)**

### Backend
- **Node.js**
- **Express**
- **MySQL**

## Installation

### 1. Install frontend dependencies
```bash
cd ../client/react-app
npm install
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Environment configuration
Create **.env** file in **server** directory and provide all environment variables (database credentials)

### 4. Database setup
Set up a MySQL database and ensure the connection details match the values in the .env file

### Run the project
#### 1. Run backend
```bash
cd server
npm run dev
```
#### 2. Run frontend
```bash
cd ../client/react-app
npm run dev
```

## Notes
- Frontend runs on port 5173
- Backend runs on port 8080
