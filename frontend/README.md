# TripGuard AI — Frontend

React + TypeScript frontend for TripGuard AI.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Axios

## Prerequisites

- Node.js 20+
- Backend API running at `http://localhost:8080/v1`

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

The Vite dev server proxies `/v1` requests to the backend, so no CORS changes are required during local development.

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/v1` | API base URL (use proxy in dev) |

## Pages

- Login / Register
- Dashboard
- Add Booking
- Booking List
- Booking Details (track status, events, notifications)

## Build

```bash
npm run build
npm run preview
```

## Auth flow

- Login stores JWT in `localStorage` under `tripguard_token`
- Axios attaches `Authorization: Bearer <token>` on protected requests
