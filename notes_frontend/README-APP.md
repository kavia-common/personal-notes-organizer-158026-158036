# Notes Frontend (Nuxt 3)

A modern, minimal Nuxt 3 frontend for a personal notes organizer.

Features:
- User authentication (register, login, logout)
- Create, edit, delete notes
- Organize notes by tags and categories
- Search and filter, show archived
- Responsive light theme with primary/secondary/accent colors

## Environment

Copy `.env.example` to `.env` and set the backend API URL:

```
cp .env.example .env
```

Edit `.env`:
```
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Development

Install and run:

```
npm install
npm run dev
```

Open http://localhost:3000

## Notes

- Auth tokens are stored in `localStorage` and sent as `Authorization: Bearer <access>`.
- When a request returns 401, the client attempts a token refresh using `/auth/refresh/`.
- Backend should implement the endpoints exposed in the provided OpenAPI.
