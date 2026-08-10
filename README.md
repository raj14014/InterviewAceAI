# InterviewAceAI — Production Deployment Package

Full-stack AI interview preparation platform.

## Structure
- `frontend/` — React + Vite + TypeScript
- `backend/` — Express + TypeScript + MongoDB/Mongoose
- `packages/` — shared extension points
- `services/code-runner/` — isolated code-runner boundary documentation
- `docs/` — architecture, deployment, security, AI and testing
- `docker-compose.yml` — local production-like stack
- `render.yaml` — backend Render deployment template

## Local
1. Copy `.env.example` to `.env`.
2. Ensure MongoDB is available.
3. `npm install`
4. `npm run dev`

Frontend: http://localhost:5173
Backend: http://localhost:5000
Health: http://localhost:5000/health

## Production environment
Backend requires `MONGODB_URI`, a strong `JWT_SECRET`, `CLIENT_URL`, and a real AI provider/key when AI_PROVIDER is not `mock`.
Frontend requires `VITE_API_URL` at build time.

## Important production boundary
Candidate code must not execute inside the Express API process. Use a sandboxed runner service with no network, resource limits and ephemeral containers before enabling real code execution.

## Deployment
- Frontend: Vercel or Nginx container
- Backend: Render/Railway or container platform
- Database: MongoDB Atlas
- AI: OpenAI/Gemini/Anthropic-compatible adapter

Run `npm run typecheck`, `npm run build`, and `npm test` in CI before promoting to production.
