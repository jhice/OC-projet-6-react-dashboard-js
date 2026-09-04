# SportSee — Project Overview

Personal sport-statistics dashboard. OpenClassrooms project 6 (React). A logged-in
user (a runner) sees their profile and running analytics: distance, heart rate,
weekly goals, session counts, duration.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 8, `@vitejs/plugin-react` |
| UI | React 19, JSX (no TypeScript) |
| Routing | `react-router` 8 (`BrowserRouter`) |
| Charts | `recharts` 3 |
| Styling | Tailwind via CDN (`index.html`), one small `header.css` + `main.css` |
| Lint | ESLint 10 flat config, `semi: "error"`, react-hooks / react-refresh |
| Auth store | JWT in `localStorage` |

Scripts: `npm run dev` / `build` / `preview` / `lint`.

## Backend expected

The app calls a REST API at `http://localhost:8000` (not in this repo). Endpoints:

- `POST /api/login` — body `{ username, password }` → `{ token, userId }`
- `GET /api/user-info` — → `{ profile, statistics }`
- `GET /api/user-activity?startWeek=YYYY-MM-DD&endWeek=YYYY-MM-DD` — activity data
- Profile images served from `http://localhost:8000/images/...`

Authenticated requests send `Authorization: Bearer <token>`.

### Mock payloads

`api+mock/` holds `.http` request samples and matching `.json` responses;
`public/` has the same JSON files. Sample data is Sophie Martin, member since
2025‑01‑01, with 7 running sessions in January 2025 (date, distance, duration,
`heartRate {min,max,average}`, `caloriesBurned`).

Test users (see `NOTES.md`): `sophiemartin`/`password123`,
`emmaleroy`/`password789`, `marcdubois`/`password456`.

## Routes (`src/main.jsx`)

| Path | Component | Access |
| --- | --- | --- |
| `/` | `Login` | public; redirects to `/dashboard` if already logged in |
| `/dashboard` | `Dashboard` | protected |
| `/profile` | `Profile` | protected |
| `*` | `Error404` | public |

All routes render inside `Layout` (`Header` + `<Outlet />` + `Footer`).
`ProtectedRoute` redirects to `/` when there is no token.

## Auth flow

1. `Login` posts credentials via `loginUser()`; on success stores the token
   through the context and navigates to `/dashboard`.
2. `useToken` (`src/hooks/useToken.js`) is the token source of truth:
   reads/writes `localStorage["token"]`, exposes `{ token, setToken, removeToken }`.
3. `LoginProvider` / `LoginContext` (`src/utils/context.jsx`) share that state
   app-wide. `Header` "Se déconnecter" calls `removeToken()` and routes to `/`.

## Data fetching

`useFetch(url)` (`src/hooks/useFetch.jsx`): `useEffect` fetch with the Bearer
header, returns `{ data, error }`, re-runs when `url` or `token` changes.
`Dashboard` and `Profile` each call it directly.

## Components (`src/components/`)

- **Login** — split-screen sign-in page (form + background image), 1440px layout.
- **Layout / Header / Footer** — shell; Header nav hidden until logged in.
- **Dashboard** — profile banner + Recharts views: 4-week km `BarChart`,
  BPM `ComposedChart` (min/max bars + average line), weekly-goals donut
  `PieChart` with a custom label, plus duration/distance stat cards.
- **Profile** — profile card (age, height, weight) + statistics grid
  (total duration, distance, sessions).
- **ProtectedRoute** — token gate.
- **Error404** — not-found page linking back to the dashboard.

## Current state / known gaps

Work in progress (see `NOTES.md` and `intégration/` static Tailwind mockups):

- **Dashboard charts still use hard-coded arrays** (`dataKm`, `dataBpm`,
  `dataGoals`) and placeholder text ("Clara Dupont", "999 km", "1970"); the
  fetched `data` is not yet wired into the charts.
- No service/module yet to transform the raw activity JSON into chart series
  (weekly aggregation, missing days).
- Some `Profile` values are still literal / struck-through (`line-through`):
  calories, rest days, gender.
- Layout is fixed-width (~1140–1440px); responsive down to 1024px is a TODO.
- No loading spinner (plain "Loading..." text); auth is client-side only
  (no refresh/CSRF), acknowledged as no more secure than `localStorage`.
