<div align="center">
  <br />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <h1>AnimeVerse</h1>
  <p>A high-performance, containerized anime streaming platform built with the MERN stack and modern DevOps practices.</p>
</div>

<br />

AnimeVerse is a production-ready, full-stack application inspired by Crunchyroll. It features a modern, responsive UI built with React and Tailwind CSS, powered by a robust Express.js backend and a scalable MongoDB database. The project is designed with best practices in mind, including containerization, microservices architecture, and CI/CD readiness.

---

## ✨ Key Features

### 🖥️ User Experience (Frontend)
- **Modern UI/UX**: Crunchyroll-inspired theme with responsive, glassmorphism design.
- **Anime Catalog**: Advanced search, genre filtering, and curated sections (Trending, Popular, Recently Added).
- **Video Streaming**: Seamless playback via React Player with a "Continue Watching" tracker.
- **Engagement**: Watchlist tracking, likes system, and nested comments/replies on episodes.

### ⚙️ Core & Admin (Backend)
- **Role-based Auth**: Secure JWT-based authentication with bcrypt hashing (User & Admin roles).
- **Admin Dashboard**: Full CMS for managing anime, episodes, and platform statistics.
- **Data Validation**: End-to-end type safety and request validation using Zod.
- **Clean Architecture**: Separation of concerns utilizing Repositories, Services, and Controllers.

### 🚀 DevOps & Infrastructure
- **Containerization**: Multi-stage Docker builds reducing frontend image size to ~25MB (Nginx).
- **Local Orchestration**: One-click local deployment using `docker-compose`.
- **Kubernetes Ready**: Planned K3s manifests and Traefik ingress for AWS free-tier hosting.
- **CI/CD Pipeline**: GitHub Actions workflows for automated linting, testing, security scanning, and deployment.

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Docker Compose / Kubernetes"
        Nginx[Frontend Container<br/>Nginx + React]
        Node[Backend Container<br/>Node.js + Express]
        
        Nginx -->|API Requests| Node
    end
    
    DB[(Supabase / MongoDB)]
    Client([User Browser])
    
    Client -->|HTTP/80| Nginx
    Node -->|TCP/5432| DB
```

---

## 💻 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, React Hook Form |
| **Backend** | Node.js 22, Express.js, JWT, Zod, Multer, Helmet, CORS |
| **Database** | MongoDB / Supabase (PostgreSQL) |
| **DevOps** | Docker, Nginx, Docker Compose, (Upcoming: Kubernetes/K3s, GitHub Actions) |
| **Testing** | Jest, MongoDB Memory Server, ESLint |

---

## 🚀 Getting Started

### Method 1: Using Docker (Recommended)

The easiest way to get the project running locally is through Docker Compose. This ensures you have the exact Node.js environment and web server configurations required.

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/animeverse.git
   cd animeverse
   ```

2. **Set up Environment Variables**
   Ensure you have a `.env` file in the `server` directory. You can copy the template:
   ```bash
   cp server/.env.example server/.env
   ```
   *(Add your Supabase/MongoDB credentials and JWT secrets to `server/.env`)*

3. **Build and Run**
   ```bash
   docker-compose up --build -d
   ```

4. **Access the Application**
   - Frontend: `http://localhost`
   - Backend API: `http://localhost:5000/api/v1/health`

### Method 2: Manual Local Setup

If you prefer to run the services manually without Docker:

**1. Start the Backend API:**
```bash
cd server
npm install
npm run dev
```

**2. Start the Frontend App:**
```bash
cd client
npm install
npm run dev
```

> **Default Admin Credentials:**
> - Email: `admin@example.com`
> - Password: `password123`

---

## 📁 Project Structure

```text
AnimeVerse/
├── client/                # React frontend application
│   ├── src/               # React components, pages, hooks, and contexts
│   ├── Dockerfile         # Multi-stage Docker build (Vite -> Nginx)
│   └── nginx.conf         # Custom Nginx configuration for SPA routing
├── server/                # Express backend API
│   ├── src/               # Controllers, services, models, and routes
│   ├── tests/             # Jest unit tests
│   └── Dockerfile         # Node.js 22 production image
├── k8s/                   # Kubernetes deployment manifests
├── docker-compose.yml     # Local orchestration configuration
└── .dockerignore          # Docker build optimizations
```

---

## 🔮 Roadmap

- [x] Full-Stack Implementation (MERN)
- [x] Docker Containerization (Multi-stage + Nginx)
- [ ] Phase 2: Kubernetes Manifests (K3s) on AWS EC2
- [ ] Phase 3: GitHub Actions CI/CD Pipeline
- [ ] Phase 4: Prometheus & Grafana Monitoring

---

## 📄 License

This project is licensed under the ISC License.
