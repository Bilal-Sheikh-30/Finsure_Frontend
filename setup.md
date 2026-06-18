# FINSURE Frontend Local Setup

This guide explains how to run the FINSURE frontend locally. The frontend is a Vite + React + TypeScript single-page app that talks to the FINSURE FastAPI backend for authentication, uploads, reports, dashboard data, chatbot responses, and Superset embedded dashboards.

## 1. Prerequisites

Install these first:

- Node.js 18 or newer
- npm, included with Node.js
- Git
- A running FINSURE backend for the real app flows

Recommended versions:

```bash
node --version
npm --version
```

Use Node 18+ because this project uses Vite 5, React 18, TypeScript 5, and modern browser tooling.

## 2. Project Location

Run all frontend commands from this directory:

```bash
cd Finsure_Frontend
```

The app entrypoint is:

```text
src/main.tsx
```

The route tree is defined in:

```text
src/App.tsx
```

## 3. Install Dependencies

For a clean, repeatable install from `package-lock.json`, use:

```bash
npm ci
```

If you are actively changing dependencies, use:

```bash
npm install
```

Do not commit `node_modules` or `dist`.

## 4. Environment Variables

Vite only exposes browser environment variables that start with `VITE_`.

Create a local environment file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux/WSL:

```bash
cp .env.example .env.local
```

Set the backend URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

This is the only frontend environment variable currently used by the code.

If `VITE_API_BASE_URL` is not set, the app falls back to:

```text
http://localhost:8000
```

Important:

- Do not include a trailing `/api` in `VITE_API_BASE_URL`.
- Correct: `http://localhost:8000`
- Incorrect: `http://localhost:8000/api`
- The frontend code appends paths like `/api/v1/auth/login` itself.

Restart the Vite dev server after changing `.env.local`.

## 5. Backend Required for Local Use

Most current frontend flows call the real backend. Start the backend before using login, signup, uploads, reports, chatbot, or dashboards.

Expected backend URL:

```text
http://localhost:8000
```

Backend docs should be reachable at:

```text
http://localhost:8000/docs
```

The backend `.env` must allow the frontend dev server origin:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

If CORS is not configured on the backend, browser requests from the frontend will fail even when the backend itself is running.

## 6. Run the Development Server

Start Vite:

```bash
npm run dev
```

Open the URL printed by Vite. By default it is:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite will either choose another port or report the conflict. Use the printed URL.

## 7. Available npm Scripts

```bash
npm run dev
```

Starts the local Vite dev server with hot reload.

```bash
npm run build
```

Creates a production build in `dist`.

```bash
npm run preview
```

Serves the built `dist` output locally. Run `npm run build` first.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm run typecheck
```

Runs TypeScript checking without emitting files.

## 8. App Routes

Public routes:

```text
/
/quickstart
/pricing
/faqs
/demo/results
/login
/signup
```

Protected routes:

```text
/dashboard
/upload
/extracted
/history
/reports
/dashboards
/settings
/security
/help
/documentation
```

Protected routes require a valid JWT in `localStorage` under:

```text
authToken
```

User profile data is stored in:

```text
user
```

The app clears these values automatically on `401` responses or expired JWTs.

## 9. Backend Endpoints Used by the Frontend

The frontend calls these backend endpoints through `src/services/apiClient.ts` and `src/components/chatbot/chatApi.ts`:

```text
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
PATCH  /api/v1/auth/edit/me
PATCH  /api/v1/auth/change-password

GET    /api/v1/auth/2fa/status
POST   /api/v1/auth/2fa/setup
POST   /api/v1/auth/2fa/setup/verify
POST   /api/v1/auth/2fa
DELETE /api/v1/auth/2fa
POST   /api/v1/auth/2fa/backup-codes/regenerate

GET    /api/v1/banks
POST   /api/v1/files/new_account
POST   /api/v1/files/upload

GET    /api/v1/data/my-upload-history
GET    /api/v1/data/my-dashboard-overview
GET    /api/v1/data/my-transaction-history

GET    /api/v1/reports
POST   /api/v1/reports/generate
GET    /api/v1/reports/:reportId

POST   /api/v1/demo/statement
POST   /api/v1/chatbot/ask
POST   /api/v1/dashboards/guest-token
```

If a page is empty or errors, check the matching backend endpoint in Swagger.

## 10. Superset Dashboard Setup

The `/dashboards` page embeds Apache Superset through `@superset-ui/embedded-sdk`.

For it to work locally:

1. Start Superset from the backend setup.
2. Make sure Superset is reachable from the browser, usually `http://localhost:8088`.
3. Configure the backend Superset variables, especially `SUPERSET_DASHBOARD_UUID`.
4. Log in to the frontend with a user that has uploaded transactions.
5. Visit:

```text
http://localhost:5173/dashboards
```

The frontend does not talk to Superset directly for credentials. It asks the backend for a guest token at:

```text
POST /api/v1/dashboards/guest-token
```

The backend response provides the Superset domain, dashboard UUID, and short-lived guest token.

## 11. Public Demo Flow

The landing page demo upload modal uses the real backend but does not require login.

It calls:

```text
GET  /api/v1/banks
POST /api/v1/demo/statement
```

Demo uploads currently accept one PDF statement at a time. Some bank statements require a password, based on the backend bank metadata.

## 12. File Upload Flow

The authenticated upload page accepts:

```text
PDF, JPG, PNG, HEIC
```

The backend OCR/parser pipeline is primarily built around PDF statements. For the smoothest local test, use PDF bank statements matching supported banks returned by:

```text
GET /api/v1/banks
```

Before uploading a statement from the authenticated app, add the matching bank account from the dashboard. The backend validates that the statement account number belongs to the logged-in user.

## 13. Production Build

Create the production build:

```bash
npm run build
```

Preview it locally:

```bash
npm run preview
```

The build output is:

```text
dist/
```

For deployment, set `VITE_API_BASE_URL` to the deployed backend origin before building, for example:

```env
VITE_API_BASE_URL=https://api.example.com
```

Because Vite injects environment variables at build time, changing `VITE_API_BASE_URL` after `npm run build` does not change the already-built files.

## 14. Useful Smoke Tests

Check the backend is reachable:

```bash
curl http://localhost:8000/
```

Check the bank list:

```bash
curl http://localhost:8000/api/v1/banks
```

Run frontend checks:

```bash
npm run typecheck
npm run lint
npm run build
```

Run the app:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

## 15. Common Problems

### `npm ci` fails

Delete the existing install and retry:

```bash
npm install
```

Use Node 18+ and make sure your package manager can access the npm registry.

### Browser says requests are blocked by CORS

Update the backend `.env`:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Restart the backend after changing CORS settings.

### Login or signup fails

Check:

- Backend is running on `http://localhost:8000`
- `VITE_API_BASE_URL` has no trailing `/api`
- Backend database migrations have been run
- Backend `.env` has `SECRET_KEY`, `ALGORITHM`, and `DATABASE_URL`

### Bank dropdown is empty

The frontend loads banks from:

```text
GET /api/v1/banks
```

Make sure the backend database has supported bank rows such as `ubl`, `meezan`, `alfalah`, and `easypaisa`.

### Upload fails after selecting a bank

Check:

- You are logged in
- The selected account exists for the current user
- The uploaded statement account number matches that account
- Password-protected statements have the correct password
- The backend OCR dependencies are installed

### Chatbot fails or times out

The chat widget calls:

```text
POST /api/v1/chatbot/ask
```

Check that the backend has the required LLM API key and that its chatbot FAISS warmup completed or can run on first request.

### Superset dashboard unavailable

Check:

- Superset is running
- Backend has `SUPERSET_DASHBOARD_UUID`
- Backend can mint guest tokens
- The logged-in user has transaction data
- Browser can reach the returned `supersetDomain`

### Styles look incomplete

This project uses Tailwind through `postcss.config.js`. There is currently no `tailwind.config.*`, so Tailwind defaults are used. Make sure `src/index.css` is imported by `src/main.tsx` and that dependencies installed successfully.

## 16. Local Development Checklist

Use this checklist for a new machine:

```text
[ ] Install Node.js 18+
[ ] cd Finsure_Frontend
[ ] npm ci
[ ] Copy .env.example to .env.local
[ ] Set VITE_API_BASE_URL=http://localhost:8000
[ ] Start the backend on http://localhost:8000
[ ] Confirm backend ALLOWED_ORIGINS includes http://localhost:5173
[ ] npm run dev
[ ] Open http://localhost:5173
[ ] Sign up or log in
[ ] Verify /dashboard loads without API errors
```
