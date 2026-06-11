# Anime Streaming API

Base URL: `http://localhost:5000/api/v1`

All protected routes require an `Authorization: Bearer <token>` header obtained from the login/signup endpoints.

## Auth

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| POST   | `/auth/register` | Create a new account |
| POST   | `/auth/login`    | Login with email/password |
| GET    | `/auth/profile`  | Current user profile |

## Users

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| PATCH  | `/users/profile`     | Update username/bio/avatar/banner |
| GET    | `/users/watchlist`   | Fetch watchlist (populated) |
| POST   | `/users/watchlist`   | Toggle watchlist (`{ animeId }`) |
| POST   | `/users/progress`    | Save playback progress (`anime`, `episode`, `progress`, `duration`) |

## Anime Catalog

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| GET    | `/anime/home`         | Featured/trending/popular/recent sections |
| GET    | `/anime`              | List with query params `search`, `genres`, `status`, `sort`, `page`, `limit` |
| GET    | `/anime/:slug`        | Get anime by slug (public) |
| GET    | `/anime/id/:id`       | Get anime by id (populated episodes) |
| POST   | `/anime`              | **Admin** create anime |
| PATCH  | `/anime/:id`          | **Admin** update anime |
| DELETE | `/anime/:id`          | **Admin** delete anime |
| POST   | `/anime/:animeId/episodes` | **Admin** upsert episode |
| DELETE | `/anime/:animeId/episodes/:episodeId` | **Admin** delete episode |
| POST   | `/anime/:id/like`     | Toggle like for current user |

## Comments

| Method | Endpoint                   | Description |
| ------ | -------------------------- | ----------- |
| GET    | `/comments/anime/:animeId` | List comments |
| POST   | `/comments/anime/:animeId` | Create comment |
| PATCH  | `/comments/:commentId`     | Update comment body |
| DELETE | `/comments/:commentId`     | Delete (owner/admin) |
| POST   | `/comments/:commentId/like`| Toggle like |

## Dashboard

| Method | Endpoint      | Description |
| ------ | ------------- | ----------- |
| GET    | `/dashboard`  | **Admin** stats summary |

## Error Format

```json
{
  "success": false,
  "message": "Description",
  "errors": []
}
```

## Seeding

```
cd server
npm run seed
```

Creates an admin account (`admin@example.com` / `password123`) and demo anime/episodes.�

