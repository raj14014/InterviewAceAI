# Build & Deployment Fixes

This package fixes the frontend build failures reported during local verification.

## Fixed

- Added Vite `ImportMetaEnv` typings for `import.meta.env.VITE_API_URL`.
- Fixed React `useEffect` callback so it does not return a Promise.
- Added a frontend `test` script using Vitest with `--passWithNoTests`.
- Added Node.js typings to the backend.
- Fixed root npm workspaces to use `frontend` and `backend`.
- Fixed root workspace scripts.
- Fixed frontend resume upload endpoint from `/resumes` to `/resumes/analyze`.
- Fixed interview question property mismatch (`question` vs `text`).
- Added an Axios timeout.
- Simplified production Dockerfiles so frontend/backend can build independently.

## Local verification commands

Frontend:

```bash
cd frontend
npm install
npm run typecheck
npm run build
npm test
```

Backend:

```bash
cd backend
npm install
npm run typecheck
npm run build
npm test
```

Root:

```bash
npm install
npm run typecheck
npm run build
npm test
```

The package does not include `node_modules`; dependencies are installed from npm during deployment or local setup.

## Functional UI completion

The frontend no longer routes the History, Coding, System Design, AI Coach, Analytics, and Profile pages through a generic placeholder component. Each has its own UI and API integration. Added `/api/practice/coding`, `/api/practice/system-design`, `/api/practice/evaluate`, and `/api/practice/coach` routes. Resume analysis now calls `/api/resumes/analyze`.
