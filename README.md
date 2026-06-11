# AniStream (MERN Crunchyroll Clone)

Full-stack anime streaming experience built with MongoDB, Express, React, and Node.js following a clean modular architecture and orange/white Crunchyroll-inspired theme.

## Features

- JWT auth with user/admin roles, profile management, and bcrypt hashing.
- Anime catalog with featured/trending/popular/recent sections, search + genre filters, and like system.
- Admin dashboard for catalog CRUD, episode management, and stats overview.
- Episode streaming with React Player, continue-watching tracking, watchlist, and comments CRUD.
- Responsive Tailwind UI with reusable components, carousels, and layouts.

## Tech Stack

- **Frontend:** Vite + React (Hooks & Context), React Router, Tailwind CSS, React Hook Form.
- **Backend:** Express.js, Mongoose, Zod validation, JWT auth, Multer, Cloudinary-ready uploads.
- **Database:** MongoDB (Atlas or local).

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance

### Environment

Copy `.env.example` to `.env` and fill values:

```
MONGO_URI=mongodb://localhost:27017/animeverse
JWT_SECRET=supersecret
PORT=5000
VITE_API_URL=http://localhost:5000/api/v1
```

### Backend

```
cd server
npm install
npm run dev    # start API with nodemon
npm run seed   # optional: load sample data + admin account
```

### Frontend

```
cd client
npm install
npm run dev    # http://localhost:5173
```

Developer login: `admin@example.com / password123` (from seed script) grants admin dashboard access.

## Testing & Linting

```
cd server
npm test       # Jest + mongodb-memory-server
npm run lint
```

## API Reference

See `docs/API.md` for endpoint details, request payloads, and auth requirements.

## Folder Structure Highlights

- `server/src` – config, models, repositories, services, controllers, middleware, routes.
- `client/src` – API layer, contexts, layouts, components, pages, hooks, utils.
- `docs/` – API documentation and future deployment notes.

## Future Enhancements

- Integrate real storage (S3/Cloudinary) for media uploads.
- Add social authentication providers.
- Improve analytics with charts and time-series data.

Enjoy binge-watching! 🧡

