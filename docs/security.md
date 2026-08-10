# Security

Helmet, CORS, rate limiting, Zod validation, bcrypt password hashing, JWT authentication, upload size/type validation, environment secrets and sanitized errors are part of the foundation. Candidate code must never execute inside the main API process; the dedicated runner remains isolated.
