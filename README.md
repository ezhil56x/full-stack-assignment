## Full-Stack Rapid Development Challenge

Challenge: AI-Powered Task Management System

I have created a full-stack task management system using next.js, go, and postgresql. I have used the gin server, gorm as postgres orm.

## Frontend

1. Go to the frontend directory

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Run the frontend

```bash
npm run dev
```

## Backend

1. Go to the backend directory

```bash
cd backend
```

2. Install dependencies

```bash
go mod download
```

3. Run the backend

```bash
go run main.go
```

### Dockerize the backend

1. Build the docker image

```bash
docker build -t taskmanager .
```

2. Run the docker container

```bash
docker run -p 8080:8080 taskmanager
```

## Database

1. Run the following command to start a PostgreSQL container

```bash
docker run --name postgres-container -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=taskmanager -p 5432:5432 -d postgres
```

## API Routes

### Auth

- POST /auth/login
- POST /auth/login

### Task

- GET /task
- GET /tasks
- POST /tasks
- PUT /task/:id
- DELETE /task/:id

### User

- GET /user/:id
- GET /users
