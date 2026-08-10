# Production Deployment

## 1. MongoDB Atlas
Create a production cluster and database user. Set `MONGODB_URI` to the Atlas connection string.

## 2. API
The API can be deployed to Render/Railway or any Node 22 host.

Required environment variables:
- `NODE_ENV=production`
- `PORT` (platform-provided when required)
- `CLIENT_URL=https://your-frontend-domain`
- `MONGODB_URI=...`
- `JWT_SECRET=<long random secret>`
- `AI_PROVIDER=mock|openai|gemini|anthropic`
- corresponding provider API key

Health endpoint: `/health`.

## 3. Frontend
Deploy `frontend` to Vercel. Set:
`VITE_API_URL=https://your-api-domain/api`

Build command: `npm run build`
Output directory: `dist`

## 4. Docker
From the repository root:
`docker compose up --build`

The local stack exposes the frontend at `http://localhost:5173` and API at `http://localhost:5000`.

## 5. Production verification
Verify registration, login, profile, resume analysis, job analysis, interview creation, answer evaluation, completion/report, analytics and logout. Use a real AI provider before advertising AI-generated evaluation as a production feature.
