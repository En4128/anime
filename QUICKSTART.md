# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection string

## Setup Steps

1. **Clone and Install Dependencies**
   ```bash
   # Install root dependencies (concurrently)
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

2. **Configure Environment**
   ```bash
   # From project root, copy .env.example to .env
   cp .env.example .env
   
   # Edit .env with your MongoDB URI
   # For local MongoDB: mongodb://localhost:27017/animeverse
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/animeverse
   ```

3. **Seed Database (Optional)**
   ```bash
   cd server
   npm run seed
   ```
   This creates:
   - Admin account: `admin@example.com` / `password123`
   - Sample anime titles with episodes

4. **Start Development Servers**
   
   **Option A: Run both servers together**
   ```bash
   # From project root
   npm run dev
   ```
   
   **Option B: Run separately**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Docs: See `docs/API.md`

## Default Admin Credentials
- Email: `admin@example.com`
- Password: `password123`

## Testing
```bash
cd server
npm test
```

## Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

